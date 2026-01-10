async function testReportList() {
    try {
        const response = await fetch('http://localhost:5000/api/reports');
        const data = await response.json();
        console.log('✅ Status:', response.status);
        console.log('Reports count:', Array.isArray(data) ? data.length : 'Not array');
        console.log('Sample Data:', Array.isArray(data) && data.length > 0 ? JSON.stringify(data[0], null, 2) : data);
    } catch (error) {
        console.error('❌ Error fetching reports:', error.message);
    }
}

testReportList();
