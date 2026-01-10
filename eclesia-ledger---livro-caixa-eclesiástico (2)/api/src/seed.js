import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clean up existing users (optional, but good for clean state)
    // await prisma.user.deleteMany({}); 

    // Create FABIANO user
    const pastor = await prisma.user.upsert({
        where: { id: 1 },
        update: {
            name: 'FABIANO',
            role: 'PASTOR',
            password: 'mapjj012426',
        },
        create: {
            name: 'FABIANO',
            role: 'PASTOR',
            password: 'mapjj012426',
        },
    });

    // Delete the old deacon if it exists (id 2) or recreate it? 
    // User asked to delete "the principal pastor and deacon".
    // Since I'm upserting ID 1 (which was Principal), it gets updated to Fabiano.
    // I should explicitly delete ID 2 (Deacon).
    try {
        await prisma.user.delete({ where: { id: 2 } });
        console.log('🗑️ Deleted old Deacon user');
    } catch (e) {
        // Ignore if not found
    }

    console.log('✅ Created/Updated user:', { pastor: pastor.name });

    const settings = await prisma.settings.upsert({
        where: { id: 1 },
        update: {
            churchName: 'MINISTÉRIO APOSTÓLICO E PROFÉTICO JEOVÁ JIRÉ',
        },
        create: {
            churchName: 'MINISTÉRIO APOSTÓLICO E PROFÉTICO JEOVÁ JIRÉ',
            monthlyGoal: 10000,
        },
    });

    console.log('✅ Created settings:', settings.churchName);

    // Sample reports remain...
    // (Keeping sample reports logic as is for data continuity if needed, or I can copy it from previous read)
    // I will just keep the previous sample reports creation logic as it was useful for testing.

    const sampleReport1 = await prisma.report.upsert({
        where: { id: '1704672000000' },
        update: {},
        create: {
            id: '1704672000000',
            date: new Date('2024-01-07'),
            serviceType: 'DOMINGO',
            deaconName: 'FABIANO', // Update deacon name in sample data to be consistent? Or keep generic. Let's keep consistent.
            attendance: 120,
            visitors: 5,
            tithes: 2500,
            offeringsPix: 800,
            offeringsCash: 450,
            offerings: 1250,
            total: 3750,
            notes: 'Culto de celebração',
            timestamp: BigInt(1704672000000),
            titheEntries: JSON.stringify([
                { id: '1', name: 'JOÃO SILVA', amount: 500, method: 'PIX' },
                { id: '2', name: 'MARIA SANTOS', amount: 300, method: 'ESPECIE' },
                { id: '3', name: 'PEDRO OLIVEIRA', amount: 1700, method: 'PIX' },
            ]),
        },
    });

    console.log('🎉 Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
