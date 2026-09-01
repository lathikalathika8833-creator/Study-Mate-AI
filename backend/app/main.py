from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .core.config import settings
from .core.database import engine, Base, SessionLocal
from .core.security import get_password_hash
from .models import User, Note, Quiz, FlashcardDeck, StudyPlan, ChatSession
from .routers import (
    auth_router,
    ai_router,
    notes_router,
    quizzes_router,
    flashcards_router,
    planner_router,
    progress_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed initial demo user and study material if database is empty
    db = SessionLocal()
    try:
        demo_user = db.query(User).filter(User.email == "alex.rivera@university.edu").first()
        if not demo_user:
            demo_user = User(
                id="usr_101",
                email="alex.rivera@university.edu",
                hashed_password=get_password_hash("password123"),
                name="Alex Rivera",
                college="Stanford University",
                major="Computer Science & Data",
                streak=7,
                topics_completed=24,
                quiz_average=89,
                study_hours_week=16.5,
                daily_goal_hours=3.5,
                today_studied_hours=2.75,
                preferences={
                    "tutorStyle": "Socratic & Step-by-Step",
                    "notifications": True,
                    "darkMode": True,
                    "difficulty": "Medium"
                }
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            # Seed sample notes
            sample_note = Note(
                id="note_1",
                user_id=demo_user.id,
                title="Java Object-Oriented Programming Core Concepts",
                subject="Computer Science",
                tags=["Java", "OOP", "Polymorphism"],
                content="# Java OOP Principles\n\nObject-Oriented Programming is based on classes and objects.\n\n### 4 Pillars of OOP:\n1. Encapsulation\n2. Inheritance\n3. Polymorphism\n4. Abstraction",
                summary="Comprehensive guide covering the 4 pillars of Java OOP: Encapsulation, Inheritance, Polymorphism, and Abstraction.",
                key_points=[
                    "Encapsulation protects internal object state with private fields and getters/setters.",
                    "Inheritance promotes DRY code reuse using extends.",
                    "Dynamic method overriding represents runtime polymorphism."
                ],
                key_definitions=[
                    {"term": "Encapsulation", "definition": "Bundling data and methods into a single unit and restricting direct access."},
                    {"term": "Polymorphism", "definition": "Ability of a single interface to execute different behaviors depending on type."}
                ],
                exam_points=[
                    "Distinguish between Abstract Classes vs Interfaces.",
                    "Explain why Java prevents multiple class inheritance."
                ]
            )
            db.add(sample_note)

            # Seed sample quiz
            sample_quiz = Quiz(
                id="quiz_1",
                user_id=demo_user.id,
                title="Java OOP & Design Patterns Mastery",
                subject="Computer Science",
                topic="Object Oriented Programming",
                difficulty="Medium",
                question_count=5,
                last_score=80,
                questions=[
                    {
                        "id": "q1",
                        "question": "Which OOP concept is primarily demonstrated when a subclass provides its own specific implementation of a method defined in its superclass?",
                        "options": [
                            "Method Overloading",
                            "Method Overriding (Runtime Polymorphism)",
                            "Data Encapsulation",
                            "Static Abstraction"
                        ],
                        "correctAnswer": 1,
                        "explanation": "Method Overriding happens when a subclass defines a method with the same name and parameters as a superclass method, enabling dynamic runtime dispatch."
                    },
                    {
                        "id": "q2",
                        "question": "Why does Java not support multiple inheritance with classes?",
                        "options": [
                            "To reduce JVM bytecode execution size",
                            "To avoid the ambiguity caused by the Diamond Problem",
                            "Because classes cannot hold constructors",
                            "It does support multiple class inheritance"
                        ],
                        "correctAnswer": 1,
                        "explanation": "The Diamond Problem creates ambiguity when two parent classes implement the same method. Java solves this via Interfaces."
                    }
                ]
            )
            db.add(sample_quiz)

            # Seed sample flashcards
            sample_deck = FlashcardDeck(
                id="deck_1",
                user_id=demo_user.id,
                title="Data Structures & Algorithms Core Flashcards",
                subject="Computer Science",
                cards_count=3,
                mastered_count=2,
                cards=[
                    {
                        "id": "fc_1",
                        "question": "What is the worst-case time complexity of QuickSort?",
                        "answer": "O(n²), occurring when pivot chosen is consistently smallest or largest.",
                        "category": "Algorithms",
                        "mastered": True
                    },
                    {
                        "id": "fc_2",
                        "question": "What is the difference between a Tree and a Graph?",
                        "answer": "A Tree is a connected acyclic graph with N nodes and N-1 edges.",
                        "category": "Data Structures",
                        "mastered": True
                    },
                    {
                        "id": "fc_3",
                        "question": "How does HashMap handle hash collisions in Java 8+?",
                        "answer": "Uses linked lists; transforms to Red-Black Trees once bucket exceeds 8 elements.",
                        "category": "Data Structures",
                        "mastered": False
                    }
                ]
            )
            db.add(sample_deck)

            # Seed sample study plan
            sample_plan = StudyPlan(
                id="plan_1",
                user_id=demo_user.id,
                title="Midterm Exam Intensive Mastery Plan",
                exam_date="2026-09-15",
                daily_hours=3.5,
                subjects=["Java OOP", "Operating Systems", "Calculus III"],
                target_score="95%+",
                days=[
                    {
                        "dayName": "Monday",
                        "date": "Sep 1",
                        "blocks": [
                            {"id": "b1", "time": "09:00 - 10:00 AM", "subject": "Java OOP", "topic": "Inheritance & Polymorphism", "type": "Study", "duration": "60 mins", "completed": True},
                            {"id": "b2", "time": "10:15 - 11:00 AM", "subject": "Operating Systems", "topic": "Process Synchronization", "type": "Study", "duration": "45 mins", "completed": True},
                            {"id": "b3", "time": "11:00 - 11:20 AM", "subject": "Break", "topic": "Hydration & Walk", "type": "Break", "duration": "20 mins", "completed": True},
                            {"id": "b4", "time": "11:20 - 12:05 PM", "subject": "Calculus III", "topic": "Gradient Vectors Practice", "type": "Practice", "duration": "45 mins", "completed": False}
                        ]
                    }
                ]
            )
            db.add(sample_plan)
            db.commit()
    except Exception as e:
        print(f"Database seed notice: {e}")
    finally:
        db.close()

    yield

app = FastAPI(
    title="StudyMate AI API",
    description="Backend REST API for StudyMate AI — College Student Personal Study Assistant",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"An unexpected server error occurred: {str(exc)}"}
    )

# Include API Routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(notes_router, prefix="/api")
app.include_router(quizzes_router, prefix="/api")
app.include_router(flashcards_router, prefix="/api")
app.include_router(planner_router, prefix="/api")
app.include_router(progress_router, prefix="/api")

@app.get("/")
def root():
    return {
        "name": "StudyMate AI API",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected"
    }
