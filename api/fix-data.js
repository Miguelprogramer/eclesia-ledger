import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fix() {
    console.log('Fixing data...');
    try {
        // Update ServiceTypes from old format to new format
        await prisma.$executeRawUnsafe(`UPDATE Report SET serviceType = 'QUARTA_FEIRA' WHERE serviceType = 'QUARTA-FEIRA'`);
        await prisma.$executeRawUnsafe(`UPDATE Report SET serviceType = 'SANTA_CEIA' WHERE serviceType = 'SANTA CEIA'`);

        // Also check for empty titheEntries that might fail parsing if they are not valid JSON strings
        // We can't easily validate JSON in SQL but we can update empty to '[]'
        await prisma.$executeRawUnsafe(`UPDATE Report SET titheEntries = '[]' WHERE titheEntries IS NULL OR titheEntries = ''`);

        console.log('✅ Data fixed');
    } catch (e) {
        console.error('❌ Error fixing data:', e);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
