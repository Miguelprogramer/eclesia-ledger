import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    console.log('Checking Data for Deletions...');
    try {
        const rows = await prisma.report.findMany();
        console.log(JSON.stringify(rows.map(r => ({
            id: r.id,
            deaconName: `[${r.deaconName}]`, // Wrap in brackets to see spaces
            serviceType: `[${r.serviceType}]`
        })), null, 2));
    } catch (e) {
        console.error('❌ Error checking data:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
