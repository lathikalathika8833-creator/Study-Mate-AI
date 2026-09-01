import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..core.database import Base

class FlashcardDeck(Base):
    __tablename__ = "flashcard_decks"

    id = Column(String, primary_key=True, default=lambda: f"deck_{uuid.uuid4().hex[:10]}")
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    subject = Column(String, nullable=False, default="General")
    cards_count = Column(Integer, default=0)
    mastered_count = Column(Integer, default=0)
    cards = Column(JSON, default=list) # Array of card objects with {id, question, answer, category, mastered}
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="flashcard_decks")
