import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();



// Helper to safely parse JSON
const safeParse = (str) => {
    if (!str) return [];
    try {
        return JSON.parse(str);
    } catch (e) {
        return [];
    }
};

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Listar todos os relatórios
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Lista de relatórios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Report'
 *     500:
 *       description: Erro no servidor
 */
router.get('/', async (req, res) => {
    try {
        const reports = await prisma.report.findMany({
            orderBy: { timestamp: 'desc' },
        });

        // Parse titheEntries JSON and map service types back
        const formattedReports = reports.map(report => ({
            ...report,
            serviceType: report.serviceType,
            timestamp: Number(report.timestamp),
            titheEntries: safeParse(report.titheEntries),
        }));

        res.json(formattedReports);
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ error: 'Erro ao buscar relatórios' });
    }
});

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Buscar relatório por ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relatório encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       404:
 *         description: Relatório não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const report = await prisma.report.findUnique({
            where: { id: req.params.id },
        });

        if (!report) {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }

        res.json({
            ...report,
            serviceType: report.serviceType,
            timestamp: Number(report.timestamp),
            titheEntries: safeParse(report.titheEntries),
        });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ error: 'Erro ao buscar relatório' });
    }
});

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Criar novo relatório
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReportRequest'
 *     responses:
 *       201:
 *         description: Relatório criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 */
router.post('/', async (req, res) => {
    try {
        const {
            date,
            serviceType,
            deaconName,
            attendance,
            visitors,
            tithes = 0,
            offeringsPix = 0,
            offeringsCash = 0,
            notes,
            titheEntries = []
        } = req.body;

        const offerings = offeringsPix + offeringsCash;
        const total = tithes + offerings;
        const timestamp = Date.now();
        const id = timestamp.toString();

        const report = await prisma.report.create({
            data: {
                id,
                date: new Date(date),
                serviceType: serviceType,
                deaconName,
                attendance,
                visitors,
                tithes,
                offeringsPix,
                offeringsCash,
                offerings,
                total,
                notes: notes || '',
                timestamp: BigInt(timestamp),
                titheEntries: JSON.stringify(titheEntries),
            },
        });

        res.status(201).json({
            ...report,
            timestamp: Number(report.timestamp),
            serviceType: report.serviceType,
            titheEntries: JSON.parse(report.titheEntries),
        });
    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({ error: 'Erro ao criar relatório' });
    }
});

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Atualizar relatório
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReportRequest'
 *     responses:
 *       200:
 *         description: Relatório atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 */
router.put('/:id', async (req, res) => {
    try {
        const {
            date,
            serviceType,
            deaconName,
            attendance,
            visitors,
            tithes = 0,
            offeringsPix = 0,
            offeringsCash = 0,
            notes,
            titheEntries = []
        } = req.body;

        const offerings = offeringsPix + offeringsCash;
        const total = tithes + offerings;

        const report = await prisma.report.update({
            where: { id: req.params.id },
            data: {
                date: new Date(date),
                serviceType: serviceType,
                deaconName,
                attendance,
                visitors,
                tithes,
                offeringsPix,
                offeringsCash,
                offerings,
                total,
                notes: notes || '',
                titheEntries: JSON.stringify(titheEntries),
            },
        });

        res.json({
            ...report,
            timestamp: Number(report.timestamp),
            serviceType: report.serviceType,
            titheEntries: JSON.parse(report.titheEntries),
        });
    } catch (error) {
        console.error('Update report error:', error);
        res.status(500).json({ error: 'Erro ao atualizar relatório' });
    }
});

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Deletar relatório (somente Pastor)
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relatório deletado
 *       404:
 *         description: Relatório não encontrado
 */
router.delete('/:id', async (req, res) => {
    try {
        await prisma.report.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Relatório deletado com sucesso' });
    } catch (error) {
        console.error('Delete report error:', error);
        res.status(500).json({ error: 'Erro ao deletar relatório' });
    }
});

export default router;
