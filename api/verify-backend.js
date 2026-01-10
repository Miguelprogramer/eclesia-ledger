// Using native fetch (Node 18+)
const BASE_URL = 'http://localhost:5000/api';

async function test() {
    console.log('🚀 Starting Backend Verification...');

    try {
        // 1. Test Login FABIANO
        const loginFabiano = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'FABIANO', role: 'PASTOR', password: 'mapjj012426' })
        });
        const resFabiano = await loginFabiano.json();
        console.log(resFabiano.success ? '✅ Login FABIANO: Success' : '❌ Login FABIANO: Failed');

        // 2. Test Login MIGUEL
        const loginMiguel = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'MIGUEL', role: 'DIACONO', password: 'miguel012426' })
        });
        const resMiguel = await loginMiguel.json();
        console.log(resMiguel.success ? '✅ Login MIGUEL: Success' : '❌ Login MIGUEL: Failed');

        // 3. Create a Report (to test deletion)
        const createReport = await fetch(`${BASE_URL}/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: new Date().toISOString(),
                serviceType: 'DOMINGO',
                deaconName: 'FABIANO',
                attendance: 10,
                visitors: 0,
                tithes: 0,
                offeringsPix: 0,
                offeringsCash: 0,
                offerings: 0,
                total: 0,
                notes: 'Test Report',
                titheEntries: []
            })
        });
        const resCreate = await createReport.json();
        console.log(resCreate.id ? `✅ Report Created: Success (ID: ${resCreate.id})` : '❌ Report Created: Failed');

        if (resCreate.id) {
            // 4. Delete the Report
            const deleteReport = await fetch(`${BASE_URL}/reports/${resCreate.id}`, {
                method: 'DELETE'
            });
            const resDelete = await deleteReport.json();
            console.log(resDelete.message ? '✅ Report Deleted: Success' : '❌ Report Deleted: Failed');
        }

    } catch (e) {
        console.error('❌ Error during verification:', e.message);
    }
}

test();
