# 🧠 AI Micro‑Frontend Component Generator

A live, stateful, AI-powered micro‑frontend platform where users can **generate**, **preview**, **edit**, and **export** React components and full pages using a conversational UI. Supports iterative development with full session management and persistent history using OpenRouter's LLMs.

## 🌐 Live Demo

👉 [Live App Link](https://your-deployment-url.com)

---

## ✨ Features

- 🔐 **Authentication**
  - Secure email/password auth with JWT + refresh token mechanism.
  - HTTP-only cookie storage for refresh tokens.
- 💬 **Chat-based AI Interaction**
  - Text prompt → AI → Code response → Live preview.
  - Incremental updates via chat ("Make it red", "Add padding").
- 📦 **Session Management**
  - Create, load, and resume full chat + code history sessions.
- 🧠 **LLM Integration**
  - Seamless connection to OpenRouter for generating/refining code.
- 💻 **Code Export & Preview**
  - View and download TSX/JSX + CSS.
  - Real-time component rendering.
- 🐳 **Docker Support**
  - Easy containerized deployment.

---

## 🛠️ Tech Stack

| Layer        | Stack                               |
|--------------|--------------------------------------|
| Frontend     | React                                |
| Backend      | Node.js + Express                   |
| Database     | MongoDB                             |
| AI Model     | OpenRouter (supports gpt4o-mini, Gemini, LLaMA, etc.) |
| Auth         | JWT + Refresh Tokens                |
| Deployment   | Amazon Web Services                 |
| Container    | Docker                              |

---

## 🔐 API Authentication Flow

1. On login/signup:
   - Returns `accessToken` (used in headers).
   - Sets `refreshToken` as `httpOnly` cookie.
2. On access token expiry:
   - Frontend silently calls `/refresh-token` to get a new `accessToken`.
3. All protected routes use a `authenticateToken` middleware.

## 📡 API Endpoints (Backend)

### Auth Routes

| Route              | Method | Description                         |
|-------------------|--------|-------------------------------------|
| `/signup`         | POST   | Create new user                     |
| `/login`          | POST   | Login with email/password           |
| `/refresh-token`  | POST   | Get new access token using refresh  |
| `/logout`         | POST   | Logout and clear session            |

### Session Routes (Protected)

| Route                             | Method | Description                                |
|----------------------------------|--------|--------------------------------------------|
| `/newSession`                    | POST   | Start a new session and generate code      |
| `/refineComponent/:sessionId`    | POST   | Refine an existing session with new prompt |
| `/allSessions`                   | GET    | List previous sessions                     |
| `/:sessionId`                    | GET    | Fetch full session with chat + code        |

--------------------------------------------------

----------------------------------------


.env Sample (Backend)
MONGO_URI=mongodb://localhost:27017/ai-component
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
OPENROUTER_API_KEY=your-key
