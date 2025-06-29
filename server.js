const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// WhatsApp Business API configuration
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

// Environment validation
const requiredEnvVars = {
    WHATSAPP_TOKEN: 'WhatsApp Business API access token',
    PHONE_NUMBER_ID: 'WhatsApp Business phone number ID',
    VERIFY_TOKEN: 'Webhook verification token'
};

const missingVars = [];
Object.entries(requiredEnvVars).forEach(([key, description]) => {
    if (!process.env[key] || process.env[key].startsWith('your_')) {
        missingVars.push(`${key} (${description})`);
    }
});

if (missingVars.length > 0) {
    console.warn('⚠️  Warning: The following environment variables are not properly configured:');
    missingVars.forEach(varInfo => console.warn(`   - ${varInfo}`));
    console.warn('📖 Please check your .env file and the README.md for setup instructions');
    console.warn('🤖 The server will start but webhooks may not work properly\n');
}

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified successfully!');
            res.status(200).send(challenge);
        } else {
            res.status(403).send('Forbidden');
        }
    }
});

// Webhook endpoint for receiving messages
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
        body.entry.forEach(entry => {
            const changes = entry.changes;
            changes.forEach(change => {
                if (change.field === 'messages') {
                    const messages = change.value.messages;
                    if (messages) {
                        messages.forEach(message => {
                            handleIncomingMessage(message, change.value.metadata.phone_number_id);
                        });
                    }
                }
            });
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.status(404).send('Not Found');
    }
});

// Function to handle incoming messages
async function handleIncomingMessage(message, phoneNumberId) {
    const from = message.from;
    const messageId = message.id;
    const messageType = message.type;

    console.log(`Received message from ${from}: ${JSON.stringify(message)}`);

    let response = '';

    if (messageType === 'text') {
        const incomingMessage = message.text.body.toLowerCase();
        response = generateResponse(incomingMessage);
    } else if (messageType === 'interactive') {
        // Handle interactive messages (buttons, lists, etc.)
        if (message.interactive.type === 'button_reply') {
            const buttonId = message.interactive.button_reply.id;
            response = handleButtonResponse(buttonId);
        } else if (message.interactive.type === 'list_reply') {
            const listId = message.interactive.list_reply.id;
            response = handleListResponse(listId);
        }
    } else {
        response = "I can only process text messages at the moment. Please send me a text message!";
    }

    // Send response back to user
    await sendMessage(from, response, phoneNumberId);
}

// Function to generate responses based on incoming messages
function generateResponse(message) {
    const responses = {
        'hello': "Hello! 👋 Welcome to our business chatbot. How can I help you today?",
        'hi': "Hi there! 👋 How can I assist you?",
        'help': "Here are some things I can help you with:\n• Business hours\n• Services\n• Contact information\n• Location\n• Pricing\n\nJust ask me about any of these topics!",
        'hours': "Our business hours are:\n📅 Monday - Friday: 9:00 AM - 6:00 PM\n📅 Saturday: 10:00 AM - 4:00 PM\n📅 Sunday: Closed",
        'services': "We offer the following services:\n• Service 1\n• Service 2\n• Service 3\n• Service 4\n\nWould you like more details about any specific service?",
        'contact': "You can reach us at:\n📞 Phone: +1-234-567-8900\n📧 Email: contact@business.com\n🌐 Website: www.business.com",
        'location': "📍 We're located at:\n123 Business Street\nCity, State 12345\n\nWe're open for visits during business hours!",
        'pricing': "For pricing information, please contact us directly or visit our website. We offer competitive rates for all our services!",
        'thanks': "You're welcome! 😊 Is there anything else I can help you with?",
        'bye': "Goodbye! 👋 Have a great day! Feel free to message us anytime."
    };

    // Check for keywords in the message
    for (const [keyword, response] of Object.entries(responses)) {
        if (message.includes(keyword)) {
            return response;
        }
    }

    // Default response for unrecognized messages
    return "I'm sorry, I didn't understand that. Type 'help' to see what I can assist you with, or contact our support team for more specific inquiries.";
}

// Function to handle button responses
function handleButtonResponse(buttonId) {
    const buttonResponses = {
        'btn_services': "Great! Here are our main services:\n• Consultation\n• Implementation\n• Support\n• Training\n\nWhich one interests you most?",
        'btn_contact': "Here's how to reach us:\n📞 Phone: +1-234-567-8900\n📧 Email: contact@business.com",
        'btn_hours': "Our business hours are:\n📅 Mon-Fri: 9:00 AM - 6:00 PM\n📅 Saturday: 10:00 AM - 4:00 PM\n📅 Sunday: Closed"
    };

    return buttonResponses[buttonId] || "Thank you for your selection!";
}

// Function to handle list responses
function handleListResponse(listId) {
    const listResponses = {
        'service_1': "You selected Service 1. This includes comprehensive consultation and basic implementation. Would you like to schedule a meeting?",
        'service_2': "You selected Service 2. This is our premium package with full support. Let me connect you with our sales team.",
        'service_3': "You selected Service 3. This is perfect for ongoing maintenance. I can help you get started right away!"
    };

    return listResponses[listId] || "Thank you for your selection!";
}

// Function to send messages via WhatsApp Business API
async function sendMessage(to, message, phoneNumberId) {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
            body: message
        }
    };

    const config = {
        headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.post(url, data, config);
        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
    }
}

// Function to send interactive messages (buttons)
async function sendInteractiveMessage(to, phoneNumberId) {
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
            type: 'button',
            header: {
                type: 'text',
                text: 'How can we help you?'
            },
            body: {
                text: 'Please select one of the options below:'
            },
            action: {
                buttons: [
                    {
                        type: 'reply',
                        reply: {
                            id: 'btn_services',
                            title: 'Our Services'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: 'btn_contact',
                            title: 'Contact Info'
                        }
                    },
                    {
                        type: 'reply',
                        reply: {
                            id: 'btn_hours',
                            title: 'Business Hours'
                        }
                    }
                ]
            }
        }
    };

    const config = {
        headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.post(url, data, config);
        console.log('Interactive message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending interactive message:', error.response?.data || error.message);
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'WhatsApp Business Chatbot is running',
        timestamp: new Date().toISOString()
    });
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`✅ WhatsApp Business Chatbot server is running on port ${PORT}`);
    console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 Environment check:`);
    console.log(`   - WHATSAPP_TOKEN: ${WHATSAPP_TOKEN ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - PHONE_NUMBER_ID: ${PHONE_NUMBER_ID ? '✅ Set' : '❌ Missing'}`);
    console.log(`   - VERIFY_TOKEN: ${VERIFY_TOKEN ? '✅ Set' : '❌ Missing'}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please try a different port or stop the existing process.`);
        console.error(`💡 You can kill the existing process with: kill $(lsof -ti:${PORT})`);
        console.error(`💡 Or set a different PORT in your .env file`);
    } else {
        console.error('❌ Server error:', err);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

module.exports = app;
