from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from datetime import datetime

class NoteBase(BaseModel):
    title: str = "Untitled Study Note"
    subject: str = "Computer Science"
    tags: Optional[List[str]] = ["General"]
    content: str = ""
    summary: Optional[str] = ""
    keyPoints: Optional[List[str]] = []
    keyDefinitions: Optional[List[Dict[str, Any]]] = []
    examPoints: Optional[List[str]] = []

class NoteCreate(NoteBase):
    pass

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    tags: Optional[List[str]] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    keyPoints: Optional[List[str]] = None
    keyDefinitions: Optional[List[Dict[str, Any]]] = None
    examPoints: Optional[List[str]] = None

class NoteResponse(NoteBase):
    id: str
    user_id: Optional[str] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

    class Config:
        from_attributes = True
