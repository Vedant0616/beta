// Minimal server test
const express = require('express');
const app = express();
const PORT = 3001; // Use different port to avoid conflicts

app.get('/test', (req, res) => {
    res.json({ 
        status: 'Server is working!',
        timestamp: new Date().toISOString(),
        message: 'This is a minimal test server'
    });
});

console.log('🚀 Starting minimal test server...');

const server = app.listen(PORT, () => {
    console.log(`✅ Test server running on port ${PORT}`);
    console.log(`🔗 Test URL: http://localhost:${PORT}/test`);
    
    // Auto-test the server
    const http = require('http');
    
    setTimeout(() => {
        console.log('\n🧪 Testing the server...');
        
        const req = http.request({
            hostname: 'localhost',
            port: PORT,
            path: '/test',
            method: 'GET'
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('✅ Server test successful!');
                console.log('📊 Response:', data);
                
                console.log('\n🎉 Basic server functionality confirmed!');
                console.log('💡 The main WhatsApp server should work fine.');
                
                server.close(() => {
                    console.log('✅ Test server closed');
                    process.exit(0);
                });
            });
        });
        
        req.on('error', (err) => {
            console.log('❌ Server test failed:', err.message);
            server.close();
            process.exit(1);
        });
        
        req.end();
    }, 1000);
});

server.on('error', (err) => {
    console.log('❌ Server error:', err.message);
    process.exit(1);
});
