// Quick dependency check
console.log('🔍 Checking dependencies...\n');

try {
    console.log('1️⃣ Checking Express...');
    const express = require('express');
    console.log('✅ Express loaded successfully');
    
    console.log('2️⃣ Checking body-parser...');
    const bodyParser = require('body-parser');
    console.log('✅ body-parser loaded successfully');
    
    console.log('3️⃣ Checking axios...');
    const axios = require('axios');
    console.log('✅ axios loaded successfully');
    
    console.log('4️⃣ Checking dotenv...');
    require('dotenv').config();
    console.log('✅ dotenv loaded successfully');
    
    console.log('\n5️⃣ Testing Express app creation...');
    const app = express();
    app.use(bodyParser.json());
    console.log('✅ Express app created successfully');
    
    console.log('\n6️⃣ Testing environment variables...');
    console.log(`PORT: ${process.env.PORT || 'Using default 3000'}`);
    console.log(`WHATSAPP_TOKEN: ${process.env.WHATSAPP_TOKEN ? 'Set' : 'Not set'}`);
    console.log(`VERIFY_TOKEN: ${process.env.VERIFY_TOKEN ? 'Set' : 'Not set'}`);
    console.log(`PHONE_NUMBER_ID: ${process.env.PHONE_NUMBER_ID ? 'Set' : 'Not set'}`);
    
    console.log('\n🎉 All dependencies are working correctly!');
    console.log('✅ The server should be able to start without issues.');
    
} catch (error) {
    console.log(`❌ Dependency error: ${error.message}`);
    console.log('Stack trace:', error.stack);
}
