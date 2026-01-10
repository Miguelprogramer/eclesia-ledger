import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureUsers() {
    console.log('Ensuring users exist...');
    try {
        // Ensure FABIANO
        const fabiano = await prisma.user.findFirst({
            where: { name: 'FABIANO' }
        });

        if (fabiano) {
            await prisma.user.update({
                where: { id: fabiano.id },
                data: { role: 'PASTOR', password: 'mapjj012426' }
            });
        } else {
            await prisma.user.create({
                data: { name: 'FABIANO', role: 'PASTOR', password: 'mapjj012426' }
            });
        }

        // Ensure MIGUEL
        const miguel = await prisma.user.findFirst({
            where: { name: 'MIGUEL' }
        });

        if (miguel) {
            await prisma.user.update({
                where: { id: miguel.id },
                data: { role: 'DIACONO', password: 'miguel012426' }
            });
        } else {
            await prisma.user.create({
                data: { name: 'MIGUEL', role: 'DIACONO', password: 'miguel012426' }
            });
        }

        console.log('✅ Users ensured.');
    } catch (e) {
        console.error('❌ Error ensuring users:', e);
    } finally {
        await prisma.$disconnect();
    }
}

ensureUsers();
