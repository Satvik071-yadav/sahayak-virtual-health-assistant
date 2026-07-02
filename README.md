# Sahayak — Virtual Health Assistant for Rural Areas

A full-stack, production-ready web application that helps people in rural
areas get basic healthcare guidance and connect with telemedicine services.

The AI chatbot is designed to **never diagnose diseases**. It provides
educational health information, basic symptom guidance, first-aid tips,
preventive healthcare advice, and always recommends professional care —
escalating immediately to emergency guidance when symptoms sound severe.

---

## ✨ What's included

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite, Tailwind CSS v4, Framer Motion, React Router, Axios |
| Backend | FastAPI, SQLAlchemy, Pydantic v2 |
| Database | PostgreSQL (production) / SQLite (local dev, zero setup) |
| Auth | JWT (OAuth2 password flow), bcrypt password hashing |
| AI | OpenAI Chat Completions (pluggable), rule-based safety layer, conversation memory |
| Deployment | Docker + Docker Compose, Nginx for the frontend |

### Feature checklist

- ✅ AI chatbot with conversation memory, English + Hindi support, and a
  hard-coded emergency keyword detector that always overrides the AI
  response when symptoms sound life-threatening
- ✅ JWT authentication (register / login / me)
- ✅ Doctor directory + telemedicine appointment booking
- ✅ Health articles (Women's health, Child health, Pregnancy, General, etc.)
- ✅ FAQ section
- ✅ BMI calculator & water intake calculator (stateless utility endpoints)
- ✅ Medicine reminders (per-user CRUD)
- ✅ Emergency contacts directory + persistent floating "Call for help" button
- ✅ Nearby hospitals directory (grouped by partner doctor hospitals) + Google Maps link
- ✅ Admin dashboard: user list, per-user chat history, live analytics
- ✅ Swagger / OpenAPI docs out of the box at `/docs`
- ✅ Rate limiting, CORS, input validation, environment-based config
- ✅ Dark mode toggle, responsive layout, glassmorphism UI

### Scope notes (read this)

This is a genuinely runnable, end-to-end implementation of the core product
covering every page and every major feature area from the spec (chatbot,
telemedicine, emergency, hospitals, health tips, admin, auth). A few things
are intentionally kept simple rather than "enterprise infra" so the project
stays runnable out of the box:

- The OpenAI integration is optional. Without an `OPENAI_API_KEY`, the
  chatbot automatically falls back to a rule-based response so the whole
  app still works for demos/local dev.
- "Nearby hospitals" is powered by the doctor directory rather than live
  geolocation/maps APIs (no external maps key required to run this).
- SQLite is used by default for zero-config local development; switch
  `DATABASE_URL` to Postgres for production (Docker Compose already does
  this for you).
- Mental health / elderly care / nutrition content lives inside the Health
  Articles system (seed more articles via the admin API/DB) rather than as
  separate hardcoded pages, so content is fully data-driven and editable.

---

## 🚀 Quick start (local development)

### 1. Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
cp .env.example .env                # edit values as needed (SECRET_KEY, OPENAI_API_KEY, ...)
python seed.py                      # creates DB tables + demo admin/doctors/articles/FAQs
uvicorn app.main:app --reload
```

Backend runs at **http://localhost:8000**. Interactive API docs at
**http://localhost:8000/docs**.

Demo admin login: `admin@vha-health.example` / `Admin@123`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:8000
npm run dev
```

Frontend runs at **http://localhost:5173**.

---

## 🐳 Run everything with Docker Compose

```bash
cp backend/.env.example backend/.env   # set SECRET_KEY, OPENAI_API_KEY, etc.
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000 (docs at `/docs`)
- Postgres: localhost:5432 (user `vha_user`, db `vha_db`)

The backend automatically creates tables on startup. Run the seed script
inside the container once if you want demo data:

```bash
docker compose exec backend python seed.py
```

---

## 🗂️ Project structure

```
vha-project/
├── backend/
│   ├── app/
│   │   ├── core/          # config, security (JWT/bcrypt), auth dependencies
│   │   ├── db/             # SQLAlchemy engine/session
│   │   ├── models/         # User, Doctor, Appointment, Message, HealthArticle,
│   │   │                   #   FAQ, Notification, MedicineReminder, EmergencyContact
│   │   ├── schemas/        # Pydantic request/response models
│   │   ├── services/       # chatbot.py — AI + safety logic
│   │   ├── routers/        # auth, chat, doctors, content, care, admin
│   │   └── main.py         # FastAPI app, CORS, rate limiting, routers
│   ├── seed.py             # demo data seeding script
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, EmergencyFAB, ProtectedRoute
│   │   ├── context/        # AuthContext, LanguageContext
│   │   ├── i18n/           # EN/HI translation strings
│   │   ├── pages/          # Home, Chatbot, Telemedicine, Emergency, HealthTips,
│   │   │                   #   Hospitals, About, Contact, Login, Register, AdminDashboard
│   │   ├── services/       # axios API client
│   │   └── types/          # shared TS interfaces
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
└── docker-compose.yml
```

---

## 🔌 API overview

All endpoints are documented interactively at `/docs` (Swagger UI) and
`/redoc`. Highlights:

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account, returns JWT |
| POST | `/api/auth/login` | OAuth2 password login, returns JWT |
| GET  | `/api/auth/me` | Current user profile |
| POST | `/api/chat/` | Send a chat message, returns AI reply + full history |
| GET  | `/api/chat/history` | Get your chat history |
| GET  | `/api/doctors/` | List doctors (optional `specialization` filter) |
| POST | `/api/doctors/appointments` | Book an appointment |
| GET  | `/api/doctors/appointments/me` | Your appointments |
| GET  | `/api/articles` | List health articles |
| GET  | `/api/faqs` | List FAQs |
| POST | `/api/tools/bmi` | BMI calculator |
| POST | `/api/tools/water-intake` | Water intake calculator |
| GET/POST | `/api/reminders` | Medicine reminders (auth required) |
| GET | `/api/emergency-contacts` | Emergency numbers |
| GET | `/api/admin/users` | (admin) list users |
| GET | `/api/admin/users/{id}/chat-history` | (admin) view a user's chat log |
| GET | `/api/admin/analytics` | (admin) usage analytics |

---

## 🔐 Security notes

- Passwords are hashed with bcrypt (never stored in plain text).
- JWT tokens are used for stateless auth; set a strong, random `SECRET_KEY`
  in production.
- CORS origins are restricted via `CORS_ORIGINS` in `.env`.
- All inputs are validated by Pydantic schemas with explicit constraints.
- Rate limiting is enabled via `slowapi` (extend per-route as needed for
  production traffic).
- The chatbot service **never lets the AI model's output override an
  emergency detection** — a keyword-based safety net runs first and always
  wins.

---

## 🧪 Testing

Basic smoke test flow (also useful as a manual QA checklist):

```bash
# health check
curl http://localhost:8000/api/health

# register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@example.com","password":"Passw0rd!","preferred_language":"en"}'

# login (OAuth2 form)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=Passw0rd!"
```

For automated tests, add `pytest` + `httpx` and write endpoint tests against
a test SQLite database — the modular router/service structure makes this
straightforward to add incrementally.

---

## 📌 Disclaimer

Sahayak provides general health education only and is not a substitute for
professional medical advice, diagnosis, or treatment. Always seek the advice
of a qualified health provider for medical concerns, and call local
emergency services immediately for any medical emergency.
