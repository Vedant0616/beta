const { spawn } = require('child_process');
const axios = require('axios');

console.log('🧪 Testing WhatsApp Chatbot Server...\n');

// Start the server
const serverProcess = spawn('node', ['server.js'], {
    stdio: ['pipe', 'pipe', 'pipe']
});

let serverOutput = '';

serverProcess.stdout.on('data', (data) => {
    serverOutput += data.toString();
    console.log('Server:', data.toString().trim());
});

serverProcess.stderr.on('data', (data) => {
    console.error('Server Error:', data.toString().trim());
});

// Wait for server to start, then test endpoints
setTimeout(async () => {
    console.log('\n🔍 Testing endpoints...');
    
    try {
        // Test health endpoint
        const healthResponse = await axios.get('http://localhost:3000/health');
        console.log('✅ Health endpoint works:', healthResponse.data);
        
        // Test webhook verification endpoint
        const webhookResponse = await axios.get('http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=your_webhook_verify_token&hub.challenge=test_challenge');
        console.log('✅ Webhook verification works:', webhookResponse.data);
        
    } catch (error) {
        console.error('❌ Endpoint test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
    
    console.log('\n🏁 Test completed. Stopping server...');
    serverProcess.kill();
}, 3000);

serverProcess.on('close', (code) => {
    console.log(`\n📊 Server process exited with code ${code}`);
    
    // Analyze server output
    if (serverOutput.includes('running on port')) {
        console.log('✅ Server started successfully');
    } else {
        console.log('❌ Server may not have started properly');
    }
    
    if (serverOutput.includes('Warning')) {
        console.log('⚠️  Environment variables need configuration');
    }
});
