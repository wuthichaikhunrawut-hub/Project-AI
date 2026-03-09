# AI Email Reply Assistant

A full-stack MVP system that uses AI to generate professional email replies for customer support.

## Features

- **AI-Powered Reply Generation**: Generates professional email responses from customer messages.
- **History Dashboard**: View all generated replies and response times.
- **Human-in-the-Loop**: Users can edit AI responses or report incorrect replies.
- **KPI Tracking**: Tracks response time for each generated reply.

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Supabase)
- **AI Service**: LLM API (Gemini / Groq / Colab endpoint)

## Prerequisites

1. Node.js (v18 or higher)
2. Supabase account (PostgreSQL database)
3. AI API key (Gemini / Groq / other)

## Setup Instructions

### 1. Clone Project

```bash
git clone <your-repo-url>
cd ai-email-reply-assistant
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the **backend** folder

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
AI_API_KEY=your-api-key
PORT=3001
```

Run backend server

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal

```bash
cd frontend
npm install
npm run dev
```

### 4. Open Application

Frontend

http://localhost:5173

Backend API

http://localhost:3001/api/health

## Project Structure

ai-email-reply-assistant/
│
├── backend/
│ ├── server.js
│ ├── db.js
│ ├── routes/
│ │ ├── generate.js
│ │ ├── history.js
│ │ └── feedback.js
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Generate.jsx
│ │ │ ├── History.jsx
│ │ │ └── Dashboard.jsx
│ │ ├── components/
│ │ └── api.js
│
└── README.md

## API Endpoints

### POST /api/generate

Generate an AI email reply.

Request

{
"message": "Customer message"
}

Response

{
"reply": "Generated email reply",
"response_time": 1500
}

### GET /api/history

Return history of generated replies.

### PUT /api/feedback/:id

Store edited replies or user feedback.

## Usage

1. Paste a customer message into the system.
2. Click **Generate Reply**.
3. AI generates a draft email reply.
4. User can **copy, edit, or report** the response.
5. The result is saved in the database for history and KPI tracking.

## Human-in-the-loop

To prevent AI mistakes:

- Users must **review the generated reply** before using it.
- Users can **edit** the reply.
- Users can **report incorrect replies**, and feedback is stored in the database.

## KPI

System measures:

Response Time

Baseline: ~10 minutes (manual reply)  
Target: ~1 minute using AI

Measurement: timestamp difference between **Generate click** and **AI response** stored in the database.

## Team Contribution Log

### Wuthichai Khunrawut
- Designed system architecture
- Developed backend (Node.js + Express)
- Integrated Supabase database
- Implemented AI integration (Colab + Llama3)
- Developed core API endpoints

### Member 2
- Developed frontend UI using React and TailwindCSS
- Implemented Generate Reply page
- Assisted with UI testing

### Member 3
- Designed dashboard layout
- Assisted with frontend styling
- Performed system testing

### Member 4
- Prepared presentation slides
- Wrote project documentation
- Assisted with report preparation

### Member 5
- Helped with testing and debugging
- Assisted with system demonstration
- Prepared demo materials
## License

Educational project for university coursework.
