# 🎓 StudyMate AI — Full-Stack AI Study Buddy

**StudyMate AI** is a state-of-the-art AI-powered personal study companion engineered for college students. It helps students understand difficult course concepts, summarize raw lecture notes, generate adaptive quizzes with instant feedback, practice with 3D active-recall flashcards, organize exam study schedules, and visualize learning progress.

---

## 🌟 Key Features

1. **AI Study Chat (24/7 Personal Tutor)**
   - Powered by Google Gemini AI.
   - Socratic method, step-by-step guidance, code breakdowns, and real-world analogies.
   - One-click prompt pills (*"Explain in simple words"*, *"Give me an example"*, *"Teach me step by step"*, *"Create exam notes"*).
   - Audio text-to-speech voice reader and syntax-highlighted code blocks.

2. **Smart Notes & AI Summarizer**
   - Rich Markdown note editor with subject categorization and tagging.
   - AI Executive Summary generator.
   - Key definitions glossary & high-yield exam watchouts extractor.
   - 1-click conversion from notes to Flashcards or Quizzes.

3. **AI Quiz Generator & Focus Player**
   - Generates custom practice exams by Subject, Topic, Difficulty (Easy, Medium, Hard), and Question Count.
   - One-question-at-a-time focus player with progress bar.
   - Instant scoring, confetti celebration on high scores, and in-depth AI answer explanations.
   - Historical quiz performance tracking.

4. **Active Recall 3D Flashcards**
   - 3D flip card animations with Question on front, Answer + Key Takeaways on back.
   - Deck generator from topic or pasted lecture notes.
   - Shuffle, Next/Previous controls, and "Mastered" vs "Need Review" spaced repetition tracking.

5. **AI Intelligent Study Planner**
   - Generates realistic weekly timetables based on target Exam Date, Daily Study Hours, and Preferred Days.
   - Balanced breakdown of Study Sessions, Practice Drills, Revision Sessions, and Active Rest Breaks.
   - Interactive daily progress checklists with XP rewards.

6. **Progress Tracking & Learning Analytics**
   - Real-time KPI summary (Quiz Avg, Topics Mastered, Study Hours, Streaks).
   - Visual charts for weekly study distribution and score trajectories.
   - AI-detected Weak Topics with direct "Practice Now" remedy links.
   - Gamified Achievement Badges grid.

7. **Authentication & Profile Management**
   - Secure JWT authentication with protected routes.
   - Student profile customization, major/college settings, and tutor style preferences.
   - Instant 1-Click Demo Login for immediate preview.

---

## 🛠️ Technology Stack

### Frontend:
- **Framework**: React 18 / 19 with Vite
- **Styling**: Tailwind CSS v3 with custom design tokens, glassmorphism, and smooth keyframe animations
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Network / API**: Axios client with JWT interceptor and offline-first fallback adapter
- **Effects**: Canvas Confetti

### Backend & AI (Architecture Blueprint):
- **Framework**: Python FastAPI
- **Data Validation**: Pydantic v2
- **ORM & Database**: SQLAlchemy & PostgreSQL
- **Security**: Passlib (Bcrypt hashing) & PyJWT
- **AI Engine**: Google Gemini API

---

## 📁 Folder Structure

```
Study Mate AI/
├── frontend/
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── Header.jsx
│   │   │       ├── ProtectedRoute.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Skeleton.jsx
│   │   │       ├── Button.jsx
│   │   │       └── Card.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── data/
│   │   │   └── mockData.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── NotesPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── FlashcardsPage.jsx
│   │   │   ├── PlannerPage.jsx
│   │   │   ├── ProgressPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── aiService.js
│   │   │   ├── notesService.js
│   │   │   ├── quizService.js
│   │   │   ├── flashcardsService.js
│   │   │   ├── plannerService.js
│   │   │   └── progressService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/                  # FastApi backend directory
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 How to Run the Frontend

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at: **`http://localhost:5173/`**

### 3. Build for Production
```bash
npm run build
```

---

## ⚡ How to Run the Backend

### 1. Set Up Python Virtual Environment
```bash
cd backend
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On macOS / Linux:
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the FastAPI Server
```bash
python run.py
```
Backend API will start at: **`http://127.0.0.1:8000`**  
Interactive Swagger API Docs available at: **`http://127.0.0.1:8000/docs`**

### 4. Run the Full Backend Test Suite
```bash
python test_suite.py
```
Runs 17 automated integration checks across Auth, Notes, Quizzes, Flashcards, Study Plans, AI Services, and Analytics.

---

## 🔐 Environment Variables

Create a `.env` file in your root and backend directory based on `.env.example`:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Backend
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:5173

# Security
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/studymate_db
```

---

## 🗄️ PostgreSQL Database Setup

1. Install PostgreSQL on your system or use a cloud provider like Supabase/Neon.
2. Create a database:
   ```sql
   CREATE DATABASE studymate_db;
   ```
3. Set your connection string in `DATABASE_URL`.

---

## 🤖 Connecting the Gemini API

1. Visit [Google AI Studio](https://aistudio.google.com/) to obtain a free API key.
2. Add your key to `backend/.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
3. The FastAPI backend will handle all AI completions securely without exposing credentials to the client browser.

---

## 📦 Deployment Instructions

- **Frontend**: Deploy on [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) by connecting the GitHub repository and setting the build command to `npm run build` and output directory to `dist`.
- **Backend**: Deploy on [Render](https://render.com/), [Railway](https://railway.app/), or [Fly.io] with Python 3.10+ and a managed PostgreSQL instance.
