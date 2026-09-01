from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import verify_password, get_password_hash, create_access_token, get_current_user
from ..models.user import User
from ..schemas.auth import UserCreate, UserLogin, UserUpdate, PasswordChange, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

def format_user_response(user: User) -> UserResponse:
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        college=user.college,
        major=user.major,
        year=user.year,
        avatar=user.avatar,
        streak=user.streak,
        topicsCompleted=user.topics_completed,
        quizAverage=user.quiz_average,
        studyHoursThisWeek=user.study_hours_week,
        dailyGoalHours=user.daily_goal_hours,
        todayStudiedHours=user.today_studied_hours,
        preferences=user.preferences,
        joinedDate=user.created_at.strftime("%B %Y") if user.created_at else "August 2026"
    )

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_in.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    # Create user
    hashed_pwd = get_password_hash(user_in.password)
    user = User(
        email=user_in.email.lower(),
        hashed_password=hashed_pwd,
        name=user_in.name,
        college=user_in.college or "University",
        major=user_in.major or "Computer Science"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate JWT token
    access_token = create_access_token(data={"sub": user.id})
    return Token(
        token=access_token,
        token_type="bearer",
        user=format_user_response(user)
    )

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.lower()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    
    access_token = create_access_token(data={"sub": user.id})
    return Token(
        token=access_token,
        token_type="bearer",
        user=format_user_response(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return format_user_response(current_user)

@router.put("/profile", response_model=UserResponse)
def update_profile(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if updates.name is not None:
        current_user.name = updates.name
    if updates.college is not None:
        current_user.college = updates.college
    if updates.major is not None:
        current_user.major = updates.major
    if updates.dailyGoalHours is not None:
        current_user.daily_goal_hours = updates.dailyGoalHours
    if updates.preferences is not None:
        current_user.preferences = updates.preferences
    
    db.commit()
    db.refresh(current_user)
    return format_user_response(current_user)

@router.post("/change-password")
def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if data.current_password and not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password verification failed."
        )
    
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"status": "success", "message": "Password updated successfully."}
