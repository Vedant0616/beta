#!/usr/bin/env node

console.log('🚀 Starting WhatsApp Chatbot Server Test...\n');

try {
    // Test 1: Check if server.js can be loaded
    console.log('1️⃣ Testing server.js loading...');
    const serverPath = './server.js';
    delete require.cache[require.resolve(serverPath)];
    
    // Temporarily override console.log to capture server output
    const originalLog = console.log;
    let serverOutput = '';
    console.log = (...args) => {
        serverOutput += args.join(' ') + '\n';
        originalLog(...args);
    };
    
    // Load the server
    require(serverPath);
    
    // Restore console.log
    console.log = originalLog;
    
    console.log('✅ Server loaded successfully');
    
    // Test 2: Check if server is listening
    setTimeout(() => {
        const http = require('http');
        
        console.log('\n2️⃣ Testing server connectivity...');
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/health',
            method: 'GET',
            timeout: 5000
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`✅ Server is responding (Status: ${res.statusCode})`);
                try {
                    const response = JSON.parse(data);
                    console.log('✅ Health check response:', response);
                } catch (e) {
                    console.log('✅ Health check response:', data);
                }
                
                console.log('\n🎉 Server is running successfully!');
                process.exit(0);
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ Server connectivity test failed: ${err.message}`);
            console.log('\n🔍 Server output:');
            console.log(serverOutput);
            process.exit(1);
        });
        
        req.on('timeout', () => {
            console.log('❌ Server response timeout');
            req.destroy();
            process.exit(1);
        });
        
        req.end();
    }, 2000);
    
} catch (error) {
    console.log(`❌ Error loading server: ${error.message}`);
    console.log('Stack trace:', error.stack);
    process.exit(1);
}
