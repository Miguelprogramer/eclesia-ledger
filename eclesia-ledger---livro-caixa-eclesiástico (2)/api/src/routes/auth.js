import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req, res) => {
    try {
        const { name, role, password } = req.body;

        if (!name || !role || !password) {
            return res.status(400).json({ error: 'Nome, role e senha são obrigatórios' });
        }

        // Find user by name and role
        const user = await prisma.user.findFirst({
            where: {
                name: name.toUpperCase(),
                role: role,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'ACESSO NEGADO: Usuário não encontrado' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'ACESSO NEGADO: SENHA INCORRETA' });
        }

        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário (somente Pastor)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req, res) => {
    try {
        const { name, role, password } = req.body;

        if (!name || !role || !password) {
            return res.status(400).json({ error: 'Nome, role e senha são obrigatórios' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                name: name.toUpperCase(),
                role: role,
            },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        const user = await prisma.user.create({
            data: {
                name: name.toUpperCase(),
                role: role,
                password: password,
            },
        });

        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

export default router;
