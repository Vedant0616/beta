const axios = require('axios');

// Test webhook verification
async function testWebhookVerification() {
    const BASE_URL = 'http://localhost:3000';
    const VERIFY_TOKEN = 'abcd'; // From your .env file
    
    console.log('🧪 Testing webhook verification...');
    
    try {
        const response = await axios.get(`${BASE_URL}/webhook`, {
            params: {
                'hub.mode': 'subscribe',
                'hub.verify_token': VERIFY_TOKEN,
                'hub.challenge': 'test_challenge_123'
            }
        });
        
        console.log('✅ Webhook verification successful!');
        console.log('Response:', response.data);
        console.log('Status:', response.status);
        return true;
    } catch (error) {
        console.log('❌ Webhook verification failed!');
        console.log('Error:', error.response?.data || error.message);
        console.log('Status:', error.response?.status);
        return false;
    }
}

// Test webhook message processing
async function testWebhookMessage() {
    const BASE_URL = 'http://localhost:3000';
    
    console.log('\n🧪 Testing webhook message processing...');
    
    const testMessage = {
        object: 'whatsapp_business_account',
        entry: [{
            id: '1124406299724354',
            changes: [{
                value: {
                    messaging_product: 'whatsapp',
                    metadata: {
                        display_phone_number: '15550000000',
                        phone_number_id: '631189900086971'
                    },
                    messages: [{
                        from: '15551234567',
                        id: 'wamid.test123',
                        timestamp: Math.floor(Date.now() / 1000).toString(),
                        text: {
                            body: 'hello'
                        },
                        type: 'text'
                    }]
                },
                field: 'messages'
            }]
        }]
    };
    
    try {
        const response = await axios.post(`${BASE_URL}/webhook`, testMessage, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Webhook message processing successful!');
        console.log('Response:', response.data);
        console.log('Status:', response.status);
        return true;
    } catch (error) {
        console.log('❌ Webhook message processing failed!');
        console.log('Error:', error.response?.data || error.message);
        console.log('Status:', error.response?.status);
        return false;
    }
}

// Test health endpoint
async function testHealthEndpoint() {
    const BASE_URL = 'http://localhost:3000';
    
    console.log('\n🧪 Testing health endpoint...');
    
    try {
        const response = await axios.get(`${BASE_URL}/health`);
        
        console.log('✅ Health endpoint working!');
        console.log('Response:', response.data);
        return true;
    } catch (error) {
        console.log('❌ Health endpoint failed!');
        console.log('Error:', error.response?.data || error.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting webhook tests...\n');
    
    const healthResult = await testHealthEndpoint();
    if (!healthResult) {
        console.log('\n❌ Server is not running! Please start with: node server.js');
        return;
    }
    
    const verificationResult = await testWebhookVerification();
    const messageResult = await testWebhookMessage();
    
    console.log('\n📊 Test Results:');
    console.log(`Health Check: ${healthResult ? '✅' : '❌'}`);
    console.log(`Webhook Verification: ${verificationResult ? '✅' : '❌'}`);
    console.log(`Message Processing: ${messageResult ? '✅' : '❌'}`);
    
    if (verificationResult && messageResult) {
        console.log('\n🎉 All tests passed! Your webhook is working correctly.');
        console.log('\n📋 Next steps:');
        console.log('1. Start ngrok: ngrok http 3000');
        console.log('2. Use the ngrok URL in Meta Developer Dashboard');
        console.log('3. Webhook URL: https://your-ngrok-url.ngrok-free.app/webhook');
        console.log('4. Verify Token: abcd');
    } else {
        console.log('\n❌ Some tests failed. Check the server logs for details.');
    }
}

if (require.main === module) {
    runTests();
}

module.exports = { testWebhookVerification, testWebhookMessage, testHealthEndpoint };
