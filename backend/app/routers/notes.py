from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.note import Note
from ..schemas.note import NoteCreate, NoteUpdate, NoteResponse

router = APIRouter(prefix="/notes", tags=["Notes"])

def format_note_response(note: Note) -> NoteResponse:
    return NoteResponse(
        id=note.id,
        user_id=note.user_id,
        title=note.title,
        subject=note.subject,
        tags=note.tags or ["General"],
        content=note.content or "",
        summary=note.summary or "",
        keyPoints=note.key_points or [],
        keyDefinitions=note.key_definitions or [],
        examPoints=note.exam_points or [],
        createdAt=note.created_at.isoformat() if note.created_at else None,
        updatedAt=note.updated_at.isoformat() if note.updated_at else None
    )

@router.get("", response_model=List[NoteResponse])
def get_notes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notes = db.query(Note).filter(Note.user_id == current_user.id).order_by(Note.updated_at.desc()).all()
    return [format_note_response(n) for n in notes]

@router.post("", response_model=NoteResponse)
def create_note(
    note_in: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_note = Note(
        user_id=current_user.id,
        title=note_in.title,
        subject=note_in.subject,
        tags=note_in.tags or ["General"],
        content=note_in.content or "",
        summary=note_in.summary or "",
        key_points=note_in.keyPoints or [],
        key_definitions=note_in.keyDefinitions or [],
        exam_points=note_in.examPoints or []
    )
    db.add(new_note)
    
    # Increment completed topic metric
    current_user.topics_completed = (current_user.topics_completed or 0) + 1
    
    db.commit()
    db.refresh(new_note)
    return format_note_response(new_note)

@router.get("/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return format_note_response(note)

@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: str,
    updates: NoteUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    
    if updates.title is not None:
        note.title = updates.title
    if updates.subject is not None:
        note.subject = updates.subject
    if updates.tags is not None:
        note.tags = updates.tags
    if updates.content is not None:
        note.content = updates.content
    if updates.summary is not None:
        note.summary = updates.summary
    if updates.keyPoints is not None:
        note.key_points = updates.keyPoints
    if updates.keyDefinitions is not None:
        note.key_definitions = updates.keyDefinitions
    if updates.examPoints is not None:
        note.exam_points = updates.examPoints
    
    db.commit()
    db.refresh(note)
    return format_note_response(note)

@router.delete("/{note_id}")
def delete_note(
    note_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return {"status": "success", "message": "Note deleted successfully"}
