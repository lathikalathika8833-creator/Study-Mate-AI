from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.study_plan import StudyPlan
from ..schemas.study_plan import StudyPlanCreate, StudyPlanResponse, BlockCompletionToggle

router = APIRouter(prefix="/study-plans", tags=["Study Planner"])

def format_plan_response(plan: StudyPlan) -> StudyPlanResponse:
    return StudyPlanResponse(
        id=plan.id,
        title=plan.title,
        examDate=plan.exam_date,
        dailyHours=plan.daily_hours or 3.5,
        subjects=plan.subjects or [],
        targetScore=plan.target_score or "95%+",
        days=plan.days or [],
        createdAt=plan.created_at.isoformat() if plan.created_at else None
    )

@router.get("", response_model=List[StudyPlanResponse])
def get_study_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    plans = db.query(StudyPlan).filter(StudyPlan.user_id == current_user.id).order_by(StudyPlan.created_at.desc()).all()
    return [format_plan_response(p) for p in plans]

@router.post("", response_model=StudyPlanResponse)
def save_study_plan(
    plan_in: StudyPlanCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exam_d = plan_in.exam_date or plan_in.examDate or "Upcoming Exam"
    daily_h = plan_in.daily_hours if plan_in.daily_hours is not None else (plan_in.dailyHours or 3.5)
    target_s = plan_in.target_score or plan_in.targetScore or "95%+"

    existing = None
    if plan_in.id:
        existing = db.query(StudyPlan).filter(StudyPlan.id == plan_in.id, StudyPlan.user_id == current_user.id).first()

    if existing:
        existing.title = plan_in.title
        existing.exam_date = exam_d
        existing.daily_hours = daily_h
        existing.subjects = plan_in.subjects
        existing.target_score = target_s
        existing.days = plan_in.days
        db.commit()
        db.refresh(existing)
        return format_plan_response(existing)

    new_plan = StudyPlan(
        id=plan_in.id,
        user_id=current_user.id,
        title=plan_in.title,
        exam_date=exam_d,
        daily_hours=daily_h,
        subjects=plan_in.subjects,
        target_score=target_s,
        days=plan_in.days
    )
    db.add(new_plan)
    db.commit()
    db.refresh(new_plan)
    return format_plan_response(new_plan)

@router.patch("/{plan_id}/blocks/{block_id}", response_model=StudyPlanResponse)
def toggle_block_completion(
    plan_id: str,
    block_id: str,
    toggle: BlockCompletionToggle,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    plan = db.query(StudyPlan).filter(StudyPlan.id == plan_id, StudyPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Study plan not found")
    
    days = plan.days or []
    updated_days = []
    for day in days:
        day_copy = dict(day)
        blocks = day_copy.get("blocks", [])
        updated_blocks = []
        for b in blocks:
            b_copy = dict(b)
            if b_copy.get("id") == block_id:
                b_copy["completed"] = toggle.completed
            updated_blocks.append(b_copy)
        day_copy["blocks"] = updated_blocks
        updated_days.append(day_copy)
    
    plan.days = updated_days
    db.commit()
    db.refresh(plan)
    return format_plan_response(plan)

@router.delete("/{plan_id}")
def delete_study_plan(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    plan = db.query(StudyPlan).filter(StudyPlan.id == plan_id, StudyPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Study plan not found")
    
    db.delete(plan)
    db.commit()
    return {"status": "success", "message": "Study plan deleted"}
