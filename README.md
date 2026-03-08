# AI Email Reply Assistant

A full-stack MVP system that uses AI to generate professional email replies for customer support.

## Features

- **AI-Powered Reply Generation**: Uses Google Gemini API to generate professional email responses
- **History Dashboard**: View all generated replies with response times
- **Human-in-the-Loop**: Edit AI responses or report incorrect ones
- **KPI Tracking**: Monitor total requests, average response time, and edited replies

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Supabase)
- **AI**: Google Gemini API

## Prerequisites

1. Node.js (v18 or higher)
2. Supabase account (for PostgreSQL database)
3. Google Gemini API key

## Setup Instructions

### 1. Clone and Setup

```bash
cd ai-email-reply-assistant
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Database URL from Supabase
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres

# Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key-here

# Server Port (optional)
PORT=3001
```

To get your Supabase connection string:
1. Go to Supabase Dashboard
2. Navigate to Settings > Database
3. Find "Connection string" section
4. Copy the URI and replace `[YOUR-PASSWORD]` with your database password

To get your Gemini API key:
1. Go to Google AI Studio (https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your .env file

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Run the Application

Start the backend server:

```bash
cd backend
npm run dev
```

In a new terminal, start the frontend:

```bash
cd frontend
npm run dev
```

### 5. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/health

## Project Structure

```
ai-email-reply-assistant/
├── backend/
│   ├── server.js          # Express server
│   ├── db.js              # Database connection
│   ├── gemini.js          # Gemini API service
│   ├── routes/
│   │   ├── generate.js    # POST /api/generate
│   │   ├── history.js     # GET /api/history
│   │   └── feedback.js   # PUT /api/feedback/:id
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── api.js
│   │   ├── pages/
│   │   │   ├── Generate.jsx
│   │   │   ├── History.jsx
│   │   │   └── Dashboard.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── ReplyCard.jsx
│   │       └── LoadingSpinner.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

### POST /api/generate

Generate an AI email reply.

**Request:**
```json
{
  "message": "Customer message here..."
}
```

**Response:**
```json
{
  "id": 1,
  "reply": "AI generated reply...",
  "response_time": 1500
}
```

### GET /api/history

Get all generated replies.

**Response:**
```json
{
  "history": [
    {
      "id": 1,
      "customer_message": "...",
      "ai_reply": "...",
      "edited_reply": "...",
      "status": "generated",
      "feedback": "...",
      "response_time": 1500,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### PUT /api/feedback/:id

Update a reply with human feedback.

**Request:**
```json
{
  "edited_reply": "Edited reply...",
  "status": "edited",
  "feedback": "Optional feedback text..."
}
```

## Usage

1. **Generate a Reply**: Go to the Generate page, paste a customer message, and click "Generate Reply"
2. **View History**: Check the History page to see all generated replies
3. **Monitor Performance**: Visit the Dashboard to track KPIs
4. **Edit or Report**: Use the Edit and Report buttons on generated replies to provide human feedback

## License

MIT
