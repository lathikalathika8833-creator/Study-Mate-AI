import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..core.database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(String, primary_key=True, default=lambda: f"quiz_{uuid.uuid4().hex[:10]}")
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    subject = Column(String, nullable=False, default="Computer Science")
    topic = Column(String, nullable=False)
    difficulty = Column(String, default="Medium")
    question_count = Column(Integer, default=5)
    last_score = Column(Integer, nullable=True)
    questions = Column(JSON, default=list) # Array of question objects with {question, options, correctAnswer, explanation}
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="quizzes")
    results = relationship("QuizResult", back_populates="quiz", cascade="all, delete-orphan")


class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(String, primary_key=True, default=lambda: f"res_{uuid.uuid4().hex[:10]}")
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    quiz_id = Column(String, ForeignKey("quizzes.id", ondelete="SET NULL"), nullable=True)
    
    quiz_title = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    score = Column(Integer, nullable=False) # Percentage (e.g. 85)
    correct_count = Column(Integer, default=0)
    total_questions = Column(Integer, default=5)
    user_answers = Column(JSON, default=dict) # { [qIndex]: selectedOption }
    
    completed_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="quiz_results")
    quiz = relationship("Quiz", back_populates="results")
