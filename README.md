# 🧠 AI Micro-Frontend Playground – Backend

This is the backend service for the **AI-driven micro-frontend playground** project. It allows users to authenticate via Google OAuth, manage sessions, and generate frontend code using an AI model (e.g., OpenRouter-compatible LLMs).

---

## 📦 Tech Stack

- **Express.js** – Server framework  
- **Prisma** – ORM for PostgreSQL  
- **JWT** – Authentication  
- **Google OAuth** – User login  
- **OpenRouter SDK** – AI model integration (OpenAI-compatible)

---

## 🚀 Features

- ✅ Google OAuth login with JWT  
- ✅ User session creation, listing, and deletion  
- ✅ Live preview support via frontend iframe  
- ✅ AI prompt support (in progress)  
- ✅ Code + message history stored per session  

---

## 📁 Folder Structure

/backend
│
├── src/
│ ├── index.ts # Express server entry point
│ ├── prisma/ # Prisma schema + migration files
│ ├── routes/
│ │ ├── auth.ts # Google OAuth route
│ │ ├── session.ts # Session CRUD API
│ │ └── ai.ts # (Optional) AI generation API
│ ├── middleware/
│ │ └── authenticate.ts # JWT verification middleware
│ └── utils/ # (Optional) helper functions
│
├── .env # Environment variables
├── package.json
└── tsconfig.json

yaml
Copy
Edit

---

## 🔐 Environment Variables

Create a `.env` file in the root:

DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENROUTER_API_KEY=your_openrouter_key

yaml
Copy
Edit

---

## 📦 Installation

```bash
git clone https://github.com/your-username/ai-micro-frontend-backend.git
cd backend
npm install
npx prisma generate
```
🧪 Running Locally
```
```
npx prisma migrate dev --name init
npm run dev
```
Server runs at http://localhost:8000

🛣️ API Endpoints
🔐 Auth
Method	Endpoint	Description
POST	/auth/google	Exchanges Google token for JWT

📚 Sessions
Method	Endpoint	Description
GET	/sessions	Get all user sessions
POST	/session	Create a new session
DELETE	/session/:id	Delete a session by ID

All above routes require Authorization: Bearer <JWT>

🤖 AI Generation (Coming Soon)
Method	Endpoint	Description
POST	/generate-code	Generate frontend code from prompt
