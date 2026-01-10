import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Eclesia Ledger API',
            version: '1.0.0',
            description: 'REST API para Sistema de Gestão Eclesiástica - Livro Caixa',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        role: { type: 'string', enum: ['PASTOR', 'DIACONO'] },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['name', 'role', 'password'],
                    properties: {
                        name: { type: 'string' },
                        role: { type: 'string', enum: ['PASTOR', 'DIACONO'] },
                        password: { type: 'string' },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['name', 'role', 'password'],
                    properties: {
                        name: { type: 'string' },
                        role: { type: 'string', enum: ['PASTOR', 'DIACONO'] },
                        password: { type: 'string' },
                    },
                },
                TitheEntry: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        amount: { type: 'number' },
                        method: { type: 'string', enum: ['PIX', 'ESPECIE'] },
                    },
                },
                Report: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        serviceType: { type: 'string', enum: ['DOMINGO', 'QUARTA_FEIRA', 'SANTA_CEIA', 'ESPECIAL'] },
                        deaconName: { type: 'string' },
                        attendance: { type: 'integer' },
                        visitors: { type: 'integer' },
                        tithes: { type: 'number' },
                        offeringsPix: { type: 'number' },
                        offeringsCash: { type: 'number' },
                        offerings: { type: 'number' },
                        total: { type: 'number' },
                        notes: { type: 'string' },
                        timestamp: { type: 'integer' },
                        titheEntries: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TitheEntry' },
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateReportRequest: {
                    type: 'object',
                    required: ['date', 'serviceType', 'deaconName', 'attendance', 'visitors'],
                    properties: {
                        date: { type: 'string' },
                        serviceType: { type: 'string', enum: ['DOMINGO', 'QUARTA-FEIRA', 'SANTA CEIA', 'ESPECIAL'] },
                        deaconName: { type: 'string' },
                        attendance: { type: 'integer' },
                        visitors: { type: 'integer' },
                        tithes: { type: 'number' },
                        offeringsPix: { type: 'number' },
                        offeringsCash: { type: 'number' },
                        notes: { type: 'string' },
                        titheEntries: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/TitheEntry' },
                        },
                    },
                },
                Settings: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        churchName: { type: 'string' },
                        monthlyGoal: { type: 'number' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                UpdateSettingsRequest: {
                    type: 'object',
                    properties: {
                        churchName: { type: 'string' },
                        monthlyGoal: { type: 'number' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
