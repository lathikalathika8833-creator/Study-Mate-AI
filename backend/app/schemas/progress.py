from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class QuizHistoryItem(BaseModel):
    date: str
    score: int
    subject: str

class WeeklyHoursItem(BaseModel):
    day: str
    hours: float
    target: float = 3.5

class TopicMasteryItem(BaseModel):
    topic: str
    score: int
    level: str
    color: str

class WeakTopicItem(BaseModel):
    topic: str
    subject: str
    accuracy: str
    recommendation: str

class BadgeItem(BaseModel):
    id: str
    title: str
    icon: str
    desc: str
    earned: bool
    date: Optional[str] = None
    progress: Optional[str] = None

class ProgressSummaryResponse(BaseModel):
    quizAverage: int
    totalQuizzes: int
    completedTopics: int
    studyHours: float
    streak: int
    quizHistory: List[QuizHistoryItem] = []
    weeklyStudyHours: List[WeeklyHoursItem] = []
    topicMastery: List[TopicMasteryItem] = []
    weakTopics: List[WeakTopicItem] = []
    badges: List[BadgeItem] = []
