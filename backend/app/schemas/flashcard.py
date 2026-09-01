from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class FlashcardItem(BaseModel):
    id: str
    question: str
    answer: str
    category: Optional[str] = "Core"
    mastered: bool = False

class FlashcardDeckCreate(BaseModel):
    id: Optional[str] = None
    title: str
    subject: str = "General"
    cards_count: Optional[int] = 0
    mastered_count: Optional[int] = 0
    cards: List[Dict[str, Any]] = []

class FlashcardDeckResponse(BaseModel):
    id: str
    title: str
    subject: str
    cardsCount: int
    masteredCount: int = 0
    cards: List[Dict[str, Any]] = []
    createdAt: Optional[str] = None

    class Config:
        from_attributes = True

class CardMasteryToggle(BaseModel):
    mastered: bool
