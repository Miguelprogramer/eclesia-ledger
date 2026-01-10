import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearReports() {
    console.log('Clearing Reports...');
    try {
        const deleted = await prisma.report.deleteMany({});
        console.log(`✅ Deleted ${deleted.count} reports.`);
    } catch (e) {
        console.error('❌ Error clearing reports:', e);
    } finally {
        await prisma.$disconnect();
    }
}

clearReports();
