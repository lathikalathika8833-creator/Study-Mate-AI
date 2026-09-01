import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(String, primary_key=True, default=lambda: f"plan_{uuid.uuid4().hex[:10]}")
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False, default="AI Exam Mastery Plan")
    exam_date = Column(String, nullable=False)
    daily_hours = Column(Float, default=3.5)
    subjects = Column(JSON, default=list) # Array of subject strings
    target_score = Column(String, default="95%+")
    days = Column(JSON, default=list) # Array of days with [{dayName, date, blocks: [{id, time, subject, topic, type, duration, completed}]}]
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="study_plans")
