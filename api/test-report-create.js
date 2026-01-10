async function testReportCreate() {
    const newReport = {
        date: '2026-01-09',
        serviceType: 'QUARTA_FEIRA', // Using the new Enum format
        deaconName: 'FABIANO',
        attendance: 50,
        visitors: 2,
        tithes: 1000,
        offeringsPix: 200,
        offeringsCash: 300,
        notes: 'Teste de criação',
        titheEntries: [
            { id: '1', name: 'TESTE', amount: 1000, method: 'ESPECIE' } // New Enum format
        ]
    };

    try {
        const response = await fetch('http://localhost:5000/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReport)
        });

        const data = await response.json();
        console.log('✅ Status:', response.status);
        console.log('Response data:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

    } catch (error) {
        console.error('❌ Error creating report:', error.message);
    }
}

testReportCreate();
