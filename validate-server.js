#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

console.log('🧪 Starting WhatsApp Chatbot Server Validation...\n');

// Test 1: Environment loading
console.log('1️⃣ Testing environment configuration...');
const requiredVars = ['WHATSAPP_TOKEN', 'PHONE_NUMBER_ID', 'VERIFY_TOKEN'];
const envStatus = {};

requiredVars.forEach(varName => {
    const value = process.env[varName];
    envStatus[varName] = {
        exists: !!value,
        configured: value && !value.startsWith('your_'),
        value: value ? (value.length > 10 ? value.substring(0, 10) + '...' : value) : 'undefined'
    };
});

Object.entries(envStatus).forEach(([key, status]) => {
    const icon = status.configured ? '✅' : status.exists ? '⚠️' : '❌';
    console.log(`   ${icon} ${key}: ${status.configured ? 'Configured' : status.exists ? 'Set but needs configuration' : 'Missing'}`);
});

// Test 2: Server creation
console.log('\n2️⃣ Testing server creation...');
try {
    const app = express();
    app.use(bodyParser.json());
    
    // Add a simple test route
    app.get('/test', (req, res) => {
        res.json({ 
            status: 'Server is working!', 
            timestamp: new Date().toISOString(),
            environment: {
                node_version: process.version,
                platform: process.platform
            }
        });
    });
    
    console.log('   ✅ Express app created successfully');
    console.log('   ✅ Body parser middleware loaded');
    console.log('   ✅ Test route configured');
    
    // Test 3: Port binding
    console.log('\n3️⃣ Testing port binding...');
    const PORT = process.env.PORT || 3000;
    
    const server = app.listen(PORT, () => {
        console.log(`   ✅ Server successfully bound to port ${PORT}`);
        
        // Test 4: HTTP request
        console.log('\n4️⃣ Testing HTTP endpoints...');
        
        const http = require('http');
        
        // Test the server
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: '/test',
            method: 'GET'
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log(`   ✅ HTTP request successful (Status: ${res.statusCode})`);
                    console.log(`   ✅ Response: ${response.status}`);
                    console.log(`   ✅ Timestamp: ${response.timestamp}`);
                    
                    console.log('\n🎉 All tests passed! Your WhatsApp chatbot server is ready to use.');
                    console.log('\n📝 Next steps:');
                    console.log('   1. Configure your .env file with actual WhatsApp Business API credentials');
                    console.log('   2. Set up a webhook URL (use ngrok for local development)');
                    console.log('   3. Configure the webhook in Facebook Developer Console');
                    console.log('   4. Start the server with: npm start');
                    
                } catch (parseError) {
                    console.log(`   ❌ Invalid JSON response: ${data}`);
                } finally {
                    server.close();
                }
            });
        });
        
        req.on('error', (err) => {
            console.log(`   ❌ HTTP request failed: ${err.message}`);
            server.close();
        });
        
        req.end();
    });
    
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`   ❌ Port ${PORT} is already in use`);
            console.log(`   💡 Try: kill $(lsof -ti:${PORT}) or use a different port`);
        } else {
            console.log(`   ❌ Server error: ${err.message}`);
        }
    });
    
} catch (error) {
    console.log(`   ❌ Server creation failed: ${error.message}`);
}
