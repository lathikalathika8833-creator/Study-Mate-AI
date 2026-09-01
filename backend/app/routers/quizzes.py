from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.quiz import Quiz, QuizResult
from ..schemas.quiz import QuizCreate, QuizResponse, QuizResultCreate, QuizResultResponse

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

def format_quiz_response(quiz: Quiz) -> QuizResponse:
    return QuizResponse(
        id=quiz.id,
        title=quiz.title,
        subject=quiz.subject,
        topic=quiz.topic,
        difficulty=quiz.difficulty or "Medium",
        questionCount=quiz.question_count or len(quiz.questions or []),
        lastScore=quiz.last_score,
        questions=quiz.questions or [],
        createdAt=quiz.created_at.isoformat() if quiz.created_at else None
    )

def format_result_response(res: QuizResult) -> QuizResultResponse:
    return QuizResultResponse(
        id=res.id,
        quizId=res.quiz_id,
        quizTitle=res.quiz_title,
        subject=res.subject,
        topic=res.topic,
        score=res.score,
        correctCount=res.correct_count,
        totalQuestions=res.total_questions,
        userAnswers=res.user_answers or {},
        completedAt=res.completed_at.isoformat() if res.completed_at else None
    )

@router.get("", response_model=List[QuizResponse])
def get_quizzes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quizzes = db.query(Quiz).filter(Quiz.user_id == current_user.id).order_by(Quiz.created_at.desc()).all()
    return [format_quiz_response(q) for q in quizzes]

@router.post("", response_model=QuizResponse)
def save_quiz(
    quiz_in: QuizCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if quiz exists
    existing = None
    if quiz_in.id:
        existing = db.query(Quiz).filter(Quiz.id == quiz_in.id, Quiz.user_id == current_user.id).first()
    
    if existing:
        existing.title = quiz_in.title
        existing.subject = quiz_in.subject
        existing.topic = quiz_in.topic
        existing.difficulty = quiz_in.difficulty
        existing.questions = quiz_in.questions
        existing.question_count = len(quiz_in.questions)
        db.commit()
        db.refresh(existing)
        return format_quiz_response(existing)

    new_quiz = Quiz(
        id=quiz_in.id,
        user_id=current_user.id,
        title=quiz_in.title,
        subject=quiz_in.subject,
        topic=quiz_in.topic,
        difficulty=quiz_in.difficulty or "Medium",
        question_count=len(quiz_in.questions),
        questions=quiz_in.questions
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)
    return format_quiz_response(new_quiz)

@router.post("/results", response_model=QuizResultResponse)
def save_quiz_result(
    result_in: QuizResultCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_result = QuizResult(
        user_id=current_user.id,
        quiz_id=result_in.quizId,
        quiz_title=result_in.quizTitle,
        subject=result_in.subject,
        topic=result_in.topic,
        score=result_in.score,
        correct_count=result_in.correctCount,
        total_questions=result_in.totalQuestions,
        user_answers=result_in.userAnswers or {}
    )
    db.add(new_result)

    # Update quiz last_score if quiz exists
    if result_in.quizId:
        quiz = db.query(Quiz).filter(Quiz.id == result_in.quizId, Quiz.user_id == current_user.id).first()
        if quiz:
            quiz.last_score = result_in.score

    # Recalculate user quiz average
    all_results = db.query(QuizResult).filter(QuizResult.user_id == current_user.id).all()
    scores = [r.score for r in all_results] + [result_in.score]
    if scores:
        current_user.quiz_average = round(sum(scores) / len(scores))

    db.commit()
    db.refresh(new_result)
    return format_result_response(new_result)

@router.get("/results", response_model=List[QuizResultResponse])
@router.get("/results/all", response_model=List[QuizResultResponse])
def get_quiz_results(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = db.query(QuizResult).filter(QuizResult.user_id == current_user.id).order_by(QuizResult.completed_at.desc()).all()
    return [format_result_response(r) for r in results]

@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz(
    quiz_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.user_id == current_user.id).first()
    if not quiz:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quiz not found")
    return format_quiz_response(quiz)
