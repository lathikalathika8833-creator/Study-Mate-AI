from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.chat import ChatSession
from ..services.ai_service import AIService
from ..schemas.ai import (
    AIChatRequest, AIChatResponse,
    AISummarizeRequest, AISummarizeResponse,
    AIQuizRequest, AIQuizResponse,
    AIFlashcardsRequest, AIFlashcardsResponse,
    AIStudyPlanRequest, AIStudyPlanResponse
)

router = APIRouter(prefix="/ai", tags=["AI Intelligence"])

@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(
    req: AIChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        response = await AIService.chat(req.message, req.context)
        return AIChatResponse(
            reply=response["reply"],
            sender="ai",
            timestamp=response["timestamp"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI chat completion failed: {str(e)}")

@router.post("/summarize", response_model=AISummarizeResponse)
async def ai_summarize(
    req: AISummarizeRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        result = await AIService.summarize_note(req.content, req.mode or "all")
        return AISummarizeResponse(
            summary=result.get("summary", ""),
            keyPoints=result.get("keyPoints", []),
            keyDefinitions=result.get("keyDefinitions", []),
            examPoints=result.get("examPoints", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI summarization failed: {str(e)}")

@router.post("/quiz", response_model=AIQuizResponse)
async def ai_quiz(
    req: AIQuizRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        result = await AIService.generate_quiz(
            subject=req.subject,
            topic=req.topic,
            difficulty=req.difficulty or "Medium",
            question_count=req.questionCount or 5
        )
        return AIQuizResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI quiz generation failed: {str(e)}")

@router.post("/flashcards", response_model=AIFlashcardsResponse)
async def ai_flashcards(
    req: AIFlashcardsRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        result = await AIService.generate_flashcards(
            subject=req.subject or "General",
            topic=req.topic,
            notes_content=req.notesContent or "",
            card_count=req.cardCount or 6
        )
        return AIFlashcardsResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI flashcard generation failed: {str(e)}")

@router.post("/study-plan", response_model=AIStudyPlanResponse)
async def ai_study_plan(
    req: AIStudyPlanRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        result = await AIService.generate_study_plan(
            exam_date=req.examDate,
            subjects=req.subjects or [],
            daily_hours=req.dailyHours or 3.5,
            preferred_days=req.preferredDays
        )
        return AIStudyPlanResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI study plan generation failed: {str(e)}")
