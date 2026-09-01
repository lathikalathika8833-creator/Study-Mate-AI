from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class AIChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class AIChatResponse(BaseModel):
    reply: str
    sender: str = "ai"
    timestamp: str

class AISummarizeRequest(BaseModel):
    content: str
    mode: Optional[str] = "all"

class KeyDefinition(BaseModel):
    term: str
    definition: str

class AISummarizeResponse(BaseModel):
    summary: str
    keyPoints: List[str] = []
    keyDefinitions: List[KeyDefinition] = []
    examPoints: List[str] = []

class AIQuizRequest(BaseModel):
    subject: str
    topic: str
    difficulty: Optional[str] = "Medium"
    questionCount: Optional[int] = 5

class AIQuizQuestion(BaseModel):
    id: Optional[str] = None
    question: str
    options: List[str]
    correctAnswer: int
    explanation: str

class AIQuizResponse(BaseModel):
    id: Optional[str] = None
    title: str
    subject: str
    topic: str
    difficulty: str
    questionCount: int
    questions: List[AIQuizQuestion]

class AIFlashcardsRequest(BaseModel):
    subject: Optional[str] = "General"
    topic: str
    notesContent: Optional[str] = ""
    cardCount: Optional[int] = 6

class AIFlashcardItem(BaseModel):
    id: Optional[str] = None
    question: str
    answer: str
    category: Optional[str] = "Core"
    mastered: bool = False

class AIFlashcardsResponse(BaseModel):
    id: Optional[str] = None
    title: str
    subject: str
    cardsCount: int
    masteredCount: int = 0
    cards: List[AIFlashcardItem]

class AIStudyPlanRequest(BaseModel):
    examDate: str
    subjects: Optional[List[str]] = []
    dailyHours: Optional[float] = 3.5
    preferredDays: Optional[List[str]] = []

class StudyBlockItem(BaseModel):
    id: str
    time: str
    subject: str
    topic: str
    type: str
    duration: str
    completed: bool = False

class StudyDayItem(BaseModel):
    dayName: str
    date: str
    blocks: List[StudyBlockItem]

class AIStudyPlanResponse(BaseModel):
    id: Optional[str] = None
    title: str
    examDate: str
    dailyHours: float
    subjects: List[str]
    targetScore: str = "95%+"
    createdAt: Optional[str] = None
    days: List[StudyDayItem]
