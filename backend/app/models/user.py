import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: f"usr_{uuid.uuid4().hex[:10]}")
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    college = Column(String, default="University")
    major = Column(String, default="Computer Science")
    year = Column(String, default="Junior")
    avatar = Column(String, default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80")
    
    # Progress stats
    streak = Column(Integer, default=1)
    topics_completed = Column(Integer, default=0)
    quiz_average = Column(Integer, default=85)
    study_hours_week = Column(Float, default=0.0)
    daily_goal_hours = Column(Float, default=3.5)
    today_studied_hours = Column(Float, default=0.0)
    
    # Preferences & Settings (stored as JSON)
    preferences = Column(JSON, default=lambda: {
        "tutorStyle": "Socratic & Step-by-Step",
        "notifications": True,
        "darkMode": True,
        "difficulty": "Medium"
    })
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    notes = relationship("Note", back_populates="user", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="user", cascade="all, delete-orphan")
    quiz_results = relationship("QuizResult", back_populates="user", cascade="all, delete-orphan")
    flashcard_decks = relationship("FlashcardDeck", back_populates="user", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
