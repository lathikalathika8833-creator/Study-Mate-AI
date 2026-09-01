from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from .ai import AIQuizQuestion

class QuizCreate(BaseModel):
    id: Optional[str] = None
    title: str
    subject: str
    topic: str
    difficulty: Optional[str] = "Medium"
    question_count: Optional[int] = 5
    questions: List[Dict[str, Any]] = []

class QuizResponse(BaseModel):
    id: str
    title: str
    subject: str
    topic: str
    difficulty: Optional[str] = "Medium"
    questionCount: Optional[int] = 5
    lastScore: Optional[int] = None
    questions: List[Dict[str, Any]] = []
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True

class QuizResultCreate(BaseModel):
    quizId: Optional[str] = None
    quizTitle: str
    subject: str
    topic: str
    score: int
    correctCount: int
    totalQuestions: int
    userAnswers: Optional[Dict[str, Any]] = {}

class QuizResultResponse(BaseModel):
    id: str
    quizId: Optional[str] = None
    quizTitle: str
    subject: str
    topic: str
    score: int
    correctCount: int
    totalQuestions: int
    userAnswers: Optional[Dict[str, Any]] = {}
    completedAt: Optional[str] = None

    class Config:
        from_attributes = True
