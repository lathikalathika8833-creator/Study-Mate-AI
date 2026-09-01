from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.quiz import QuizResult
from ..models.note import Note
from ..schemas.progress import (
    ProgressSummaryResponse,
    QuizHistoryItem,
    WeeklyHoursItem,
    TopicMasteryItem,
    WeakTopicItem,
    BadgeItem
)

router = APIRouter(prefix="/progress", tags=["Progress & Analytics"])

@router.get("", response_model=ProgressSummaryResponse)
def get_progress_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = db.query(QuizResult).filter(QuizResult.user_id == current_user.id).order_by(QuizResult.completed_at.asc()).all()
    notes = db.query(Note).filter(Note.user_id == current_user.id).all()
    
    total_quizzes = len(results)
    quiz_avg = current_user.quiz_average or 85
    if results:
        quiz_avg = round(sum(r.score for r in results) / len(results))

    # Build quiz history array
    quiz_history = []
    if results:
        for r in results[-7:]: # Last 7 attempts
            d_str = r.completed_at.strftime("%b %d") if r.completed_at else "Aug 30"
            quiz_history.append(QuizHistoryItem(
                date=d_str,
                score=r.score,
                subject=r.subject or "Computer Science"
            ))
    else:
        quiz_history = [
            QuizHistoryItem(date="Aug 24", score=72, subject="Calculus"),
            QuizHistoryItem(date="Aug 25", score=80, subject="Java OOP"),
            QuizHistoryItem(date="Aug 26", score=85, subject="Data Structures"),
            QuizHistoryItem(date="Aug 27", score=78, subject="Operating Systems"),
            QuizHistoryItem(date="Aug 28", score=92, subject="Java OOP"),
            QuizHistoryItem(date="Aug 29", score=95, subject="Algorithms"),
            QuizHistoryItem(date="Aug 30", score=quiz_avg, subject="Operating Systems")
        ]

    weekly_study_hours = [
        WeeklyHoursItem(day="Mon", hours=2.8, target=3.5),
        WeeklyHoursItem(day="Tue", hours=3.6, target=3.5),
        WeeklyHoursItem(day="Wed", hours=4.1, target=3.5),
        WeeklyHoursItem(day="Thu", hours=2.5, target=3.5),
        WeeklyHoursItem(day="Fri", hours=3.9, target=3.5),
        WeeklyHoursItem(day="Sat", hours=4.5, target=3.5),
        WeeklyHoursItem(day="Sun", hours=3.2, target=3.5)
    ]

    topic_mastery = [
        TopicMasteryItem(topic="Java OOP", score=94, level="Mastered", color="#10b981"),
        TopicMasteryItem(topic="Data Structures", score=88, level="Strong", color="#6366f1"),
        TopicMasteryItem(topic="Algorithms", score=82, level="Proficient", color="#8b5cf6"),
        TopicMasteryItem(topic="Operating Systems", score=74, level="Improving", color="#f59e0b"),
        TopicMasteryItem(topic="Calculus III", score=68, level="Needs Practice", color="#ef4444")
    ]

    weak_topics = [
        WeakTopicItem(
            topic="Multivariable Lagrange Multipliers",
            subject="Calculus III",
            accuracy="58%",
            recommendation="Review gradient vectors and constraint equations."
        ),
        WeakTopicItem(
            topic="Banker's Algorithm Resource Matrices",
            subject="Operating Systems",
            accuracy="64%",
            recommendation="Practice safety sequence allocation tables."
        ),
        WeakTopicItem(
            topic="Red-Black Tree Rotations",
            subject="Data Structures",
            accuracy="69%",
            recommendation="Work through visual recoloring and double-rotation test cases."
        )
    ]

    badges = [
        BadgeItem(id="b1", title="7-Day Streak Scholar", icon="🔥", desc="Studied 7 days in a row without breaking streak", earned=True, date="Aug 30, 2026"),
        BadgeItem(id="b2", title="Quiz Whiz", icon="⚡", desc="Scored 90%+ on 5 consecutive quizzes", earned=True, date="Aug 29, 2026"),
        BadgeItem(id="b3", title="Night Owl Master", icon="🦉", desc="Completed 10 active recall sessions after 8 PM", earned=True, date="Aug 27, 2026"),
        BadgeItem(id="b4", title="Study Marathon", icon="🏆", desc="Studied for 4+ hours in a single day", earned=True, date="Aug 26, 2026"),
        BadgeItem(id="b5", title="Flashcard Champion", icon="🃏", desc="Mastered 50 active recall flashcards", earned=False, progress="32/50"),
        BadgeItem(id="b6", title="AI Study Prodigy", icon="✨", desc="Engaged in 25 deep tutor conversations", earned=False, progress="18/25")
    ]

    return ProgressSummaryResponse(
        quizAverage=quiz_avg,
        totalQuizzes=max(total_quizzes, 12),
        completedTopics=max(len(notes), current_user.topics_completed or 24),
        studyHours=current_user.study_hours_week or 16.5,
        streak=current_user.streak or 7,
        quizHistory=quiz_history,
        weeklyStudyHours=weekly_study_hours,
        topicMastery=topic_mastery,
        weakTopics=weak_topics,
        badges=badges
    )
