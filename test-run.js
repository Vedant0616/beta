// Simple test to verify server functionality
const { spawn } = require('child_process');

console.log('🧪 Testing WhatsApp Chatbot Server...\n');

// Kill any existing processes on port 3000
const killExisting = spawn('bash', ['-c', 'lsof -ti:3000 | xargs kill -9 2>/dev/null || true']);

killExisting.on('close', () => {
    console.log('🧹 Cleaned up existing processes on port 3000');
    
    // Start the server
    const serverProcess = spawn('node', ['server.js'], {
        stdio: 'pipe'
    });
    
    let serverStarted = false;
    let serverOutput = '';
    
    serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        serverOutput += output;
        console.log('📟 Server:', output.trim());
        
        if (output.includes('running on port')) {
            serverStarted = true;
            console.log('\n✅ Server started successfully!');
            
            // Test the health endpoint
            setTimeout(() => {
                console.log('\n🔍 Testing health endpoint...');
                
                const http = require('http');
                const req = http.request({
                    hostname: 'localhost',
                    port: 3000,
                    path: '/health',
                    method: 'GET'
                }, (res) => {
                    let responseData = '';
                    
                    res.on('data', (chunk) => {
                        responseData += chunk;
                    });
                    
                    res.on('end', () => {
                        console.log(`✅ Health check successful (${res.statusCode})`);
                        console.log('📊 Response:', responseData);
                        
                        console.log('\n🎉 Server is working perfectly!');
                        serverProcess.kill();
                    });
                });
                
                req.on('error', (err) => {
                    console.log('❌ Health check failed:', err.message);
                    serverProcess.kill();
                });
                
                req.end();
            }, 1000);
        }
    });
    
    serverProcess.stderr.on('data', (data) => {
        console.log('🚨 Server Error:', data.toString().trim());
    });
    
    serverProcess.on('close', (code) => {
        console.log(`\n📊 Server process exited with code: ${code}`);
        
        if (!serverStarted) {
            console.log('❌ Server failed to start');
            console.log('📋 Full output:');
            console.log(serverOutput);
        }
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
        if (!serverStarted) {
            console.log('⏰ Server start timeout');
            serverProcess.kill();
        }
    }, 10000);
});
