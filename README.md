# WhatsApp Business Chatbot

A simple and extensible WhatsApp Business chatbot built with Node.js and the WhatsApp Business API.

## Features

- ✅ Webhook verification for WhatsApp Business API
- ✅ Automated responses to common queries
- ✅ Support for text messages
- ✅ Interactive messages (buttons and lists)
- ✅ Customizable response system
- ✅ Easy to extend and modify

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 14 or higher)
2. **WhatsApp Business Account** with API access
3. **Facebook Developer Account**
4. **Webhook URL** (you can use ngrok for local development)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd whatsapp-business-chatbot

# Install dependencies
npm install
```

### 2. WhatsApp Business API Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add WhatsApp Business API to your app
4. Get your:
   - Access Token
   - Phone Number ID
   - Business Account ID

### 3. Configure Environment Variables

Copy the `.env` file and fill in your credentials:

```bash
# WhatsApp Business Account Credentials
WHATSAPP_TOKEN=your_whatsapp_business_api_token
VERIFY_TOKEN=your_webhook_verify_token
PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# Server Configuration
PORT=3000
```

### 4. Set Up Webhook

1. **For local development**, use ngrok:
   ```bash
   # Install ngrok globally
   npm install -g ngrok
   
   # Start your server
   npm start
   
   # In another terminal, expose your local server
   ngrok http 3000
   ```

2. **Configure webhook in Facebook Developer Console**:
   - Webhook URL: `https://your-ngrok-url.ngrok.io/webhook`
   - Verify Token: Use the same token you set in your `.env` file
   - Subscribe to `messages` events

### 5. Run the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## Usage

Once your chatbot is running and properly configured:

1. Send a message to your WhatsApp Business number
2. The bot will automatically respond based on keywords
3. Try these sample messages:
   - "hello" or "hi" - Greeting
   - "help" - Show available commands
   - "hours" - Business hours
   - "services" - Available services
   - "contact" - Contact information
   - "location" - Business location
   - "pricing" - Pricing information

## Customization

### Adding New Responses

Edit the `generateResponse()` function in `server.js`:

```javascript
const responses = {
    'your_keyword': "Your custom response here",
    // Add more keyword-response pairs
};
```

### Adding Interactive Messages

The bot supports buttons and lists. See the `sendInteractiveMessage()` function for examples.

### Webhook Events

The bot currently handles:
- Text messages
- Interactive message replies (buttons/lists)

You can extend it to handle:
- Media messages (images, documents, etc.)
- Location messages
- Contact messages

## API Endpoints

- `GET /webhook` - Webhook verification
- `POST /webhook` - Receive WhatsApp messages
- `GET /health` - Health check endpoint

## File Structure

```
whatsapp-business-chatbot/
├── server.js          # Main application file
├── package.json       # Project dependencies and scripts
├── .env              # Environment variables (not in git)
├── .gitignore        # Git ignore file
└── README.md         # This file
```

## Troubleshooting

### Common Issues

1. **Webhook not receiving messages**:
   - Check if your webhook URL is publicly accessible
   - Verify the webhook token matches your environment variable
   - Ensure you're subscribed to the correct webhook events

2. **Messages not sending**:
   - Verify your WhatsApp token is valid
   - Check the phone number ID is correct
   - Ensure your business account has the necessary permissions

3. **Server not starting**:
   - Check if the port is already in use
   - Verify all environment variables are set correctly

### Debug Mode

Enable detailed logging by adding console.log statements or use a debugging tool like node inspector.

## Security Notes

- Never commit your `.env` file to version control
- Use HTTPS for production webhooks
- Implement rate limiting for production use
- Validate and sanitize all incoming messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review WhatsApp Business API documentation
3. Create an issue in the repository

## Next Steps

To enhance your chatbot, consider adding:
- Database integration for user data
- AI/ML capabilities for better responses
- Multi-language support
- Analytics and logging
- Advanced conversation flows
- Integration with CRM systems
