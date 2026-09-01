from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    college: Optional[str] = "University"
    major: Optional[str] = "Computer Science"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    major: Optional[str] = None
    dailyGoalHours: Optional[float] = None
    preferences: Optional[Dict[str, Any]] = None

class PasswordChange(BaseModel):
    current_password: Optional[str] = None
    new_password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    college: Optional[str] = None
    major: Optional[str] = None
    year: Optional[str] = None
    avatar: Optional[str] = None
    streak: int = 1
    topicsCompleted: int = 0
    quizAverage: int = 85
    studyHoursThisWeek: float = 0.0
    dailyGoalHours: float = 3.5
    todayStudiedHours: float = 0.0
    preferences: Optional[Dict[str, Any]] = None
    joinedDate: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    token: str
    token_type: str = "bearer"
    user: UserResponse
