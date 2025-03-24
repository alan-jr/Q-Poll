# Q-Poll: Modern Real-time Polling Platform

Q-Poll is an innovative polling platform that allows users to create and participate in polls with unique features like sentiment analysis, real-time updates, and engagement scoring.

## Features

- **Real-time Poll Updates**: Watch votes come in instantly using Socket.IO
- **Sentiment Analysis**: Capture emotional responses to poll options
- **Engagement Scoring**: Unique algorithm to measure poll engagement
- **Interactive UI**: Beautiful animations and transitions
- **Drag & Drop**: Easy poll option reordering
- **QR Code Sharing**: Instantly share polls via QR codes
- **Mobile Responsive**: Works seamlessly on all devices

## Tech Stack

- Frontend: React.js with Material-UI and Framer Motion
- Backend: Node.js with Express
- Database: MongoDB
- Real-time: Socket.IO
- Styling: Emotion (CSS-in-JS)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/q-poll.git
   cd q-poll
   ```

2. Install dependencies:
   ```bash
   npm install
   npm run install-client
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/q-poll
   JWT_SECRET=your-secret-key-here
   ```

4. Start the development servers:
   ```bash
   # Run both frontend and backend
   npm run dev

   # Run backend only
   npm run server

   # Run frontend only
   npm run client
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
q-poll/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main app component
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── .env                  # Environment variables
└── package.json          # Project dependencies
```

## API Endpoints

- `POST /api/polls` - Create a new poll
- `GET /api/polls` - Get all polls (with filters)
- `GET /api/polls/:id` - Get a specific poll
- `POST /api/polls/:id/vote` - Cast a vote
- `GET /api/polls/:id/results` - Get poll results
- `DELETE /api/polls/:id` - Delete a poll

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.