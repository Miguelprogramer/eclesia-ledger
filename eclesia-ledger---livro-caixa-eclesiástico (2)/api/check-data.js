import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    console.log('Checking Data...');
    try {
        const rows = await prisma.$queryRaw`SELECT id, serviceType FROM Report`;
        console.log(rows);
    } catch (e) {
        console.error('❌ Error checking data:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
