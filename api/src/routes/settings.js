import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Buscar configurações da igreja
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Configurações atuais
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settings'
 */
router.get('/', async (req, res) => {
    try {
        let settings = await prisma.settings.findFirst();

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    churchName: 'MINHA IGREJA',
                    monthlyGoal: 5000,
                },
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            error: 'Erro ao buscar configurações',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /api/settings:
 *   put:
 *     summary: Atualizar configurações (somente Pastor)
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSettingsRequest'
 *     responses:
 *       200:
 *         description: Configurações atualizadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settings'
 */
router.put('/', async (req, res) => {
    try {
        const { churchName, monthlyGoal } = req.body;

        // Get existing settings or create if none exist
        let settings = await prisma.settings.findFirst();

        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    churchName: churchName || 'MINHA IGREJA',
                    monthlyGoal: monthlyGoal || 5000,
                },
            });
        } else {
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data: {
                    ...(churchName !== undefined && { churchName }),
                    ...(monthlyGoal !== undefined && { monthlyGoal }),
                },
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            error: 'Erro ao atualizar configurações',
            details: error.message
        });
    }
});

export default router;
