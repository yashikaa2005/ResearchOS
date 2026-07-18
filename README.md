# ResearchOS

ResearchOS is an AI-powered research workspace designed to help researchers, students, and professionals organize research projects, manage academic papers, take structured notes, and generate AI-assisted insights from their research.

The application provides a centralized workspace where users can upload research papers, organize notes, analyze documents using AI, and visualize research knowledge through an interactive knowledge graph.

---

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Persistent Login

### Project Management

- Create Projects
- Update Projects
- Delete Projects
- Dashboard Overview
- Project Workspace

### Research Paper Management

- Upload PDF Research Papers
- Automatic PDF Text Extraction
- Paper Library
- Background Processing
- Paper Status Tracking

### Notes

- Create Notes
- Edit Notes
- Delete Notes
- Save Notes
- Project-wise Organization

### AI Insights

- AI Generated Paper Summaries
- Concept Extraction
- Key Findings Extraction
- Cross-paper Contradiction Detection
- Research Gap Identification
- Graceful fallback when Gemini API is unavailable

### Knowledge Graph

- Interactive visualization of papers and extracted concepts
- Relationship mapping between research topics

### Timeline

- Activity history for projects
- Research workflow tracking

### Dashboard

- Recent Projects
- Quick Actions
- Recent Activity
- Workspace Navigation

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Context API
- Axios
- Tailwind CSS
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- pdf-parse

### AI

- Google Gemini API

---

## Project Structure

```
ResearchOS
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── layouts
│   │   ├── pages
│   │   ├── routes
│   │   └── services
│   │
│   └── package.json
│
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   │
│   └── package.json
│
└── README.md
```

---

## Architecture

### Backend

```
Routes
    ↓
Controllers
    ↓
Services
    ↓
MongoDB
```

### Frontend

```
Pages
    ↓
Components
    ↓
Context API
    ↓
Services
    ↓
Axios
    ↓
Backend API
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/<your-username>/ResearchOS.git

cd ResearchOS
```

---

### Backend Setup

```bash
cd server

npm install
```

Create a `.env` file.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client

npm install
```

Create a `.env` file.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

---

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| PORT | Backend server port |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | JWT signing secret |
| GEMINI_API_KEY | Google Gemini API Key |

### Frontend

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |

---

## API Overview

### Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/me
```

### Projects

```
GET /api/projects

POST /api/projects

GET /api/projects/:id

PUT /api/projects/:id

DELETE /api/projects/:id
```

### Papers

```
POST /api/papers/upload

GET /api/papers/:projectId

DELETE /api/papers/:paperId
```

### Notes

```
GET /api/notes/:projectId

POST /api/notes

PUT /api/notes/:noteId

DELETE /api/notes/:noteId
```

### Insights

```
GET /api/insights/:projectId
```

---

## Current Status

Implemented:

- Authentication
- Project Management
- Dashboard
- Project Workspace
- Paper Upload
- Notes
- AI Insights
- Knowledge Graph
- Timeline
- Settings

Planned:

- Global Research Search
- Enhanced Quick Actions
- Rich Text Notes
- Advanced Knowledge Graph
- Collaboration Features

---

## Future Enhancements

- Semantic Search
- AI Chat with Research Papers
- Citation Generation
- Research Timeline Analytics
- Real-time Collaboration
- Export Notes
- Reference Manager Integration
- Multi-user Project Sharing

---

## License

This project is developed for educational and research purposes.