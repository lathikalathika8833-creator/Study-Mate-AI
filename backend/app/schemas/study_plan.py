from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class StudyPlanCreate(BaseModel):
    id: Optional[str] = None
    title: str = "AI Exam Mastery Plan"
    exam_date: Optional[str] = None
    examDate: Optional[str] = None
    daily_hours: Optional[float] = 3.5
    dailyHours: Optional[float] = 3.5
    subjects: List[str] = []
    target_score: Optional[str] = "95%+"
    targetScore: Optional[str] = "95%+"
    days: List[Dict[str, Any]] = []

class StudyPlanResponse(BaseModel):
    id: str
    title: str
    examDate: str
    dailyHours: float
    subjects: List[str] = []
    targetScore: Optional[str] = "95%+"
    days: List[Dict[str, Any]] = []
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True

class BlockCompletionToggle(BaseModel):
    completed: bool
