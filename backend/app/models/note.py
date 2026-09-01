import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..core.database import Base

class Note(Base):
    __tablename__ = "notes"

    id = Column(String, primary_key=True, default=lambda: f"note_{uuid.uuid4().hex[:10]}")
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False, default="Untitled Study Note")
    subject = Column(String, nullable=False, default="Computer Science")
    tags = Column(JSON, default=lambda: ["General"])
    content = Column(Text, nullable=False, default="")
    
    # AI Processed Metadata
    summary = Column(Text, nullable=True, default="")
    key_points = Column(JSON, default=list)
    key_definitions = Column(JSON, default=list)
    exam_points = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notes")
