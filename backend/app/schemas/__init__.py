from .auth import UserCreate, UserLogin, UserUpdate, PasswordChange, UserResponse, Token
from .ai import (
    AIChatRequest, AIChatResponse,
    AISummarizeRequest, AISummarizeResponse,
    AIQuizRequest, AIQuizResponse,
    AIFlashcardsRequest, AIFlashcardsResponse,
    AIStudyPlanRequest, AIStudyPlanResponse
)
from .note import NoteCreate, NoteUpdate, NoteResponse
from .quiz import QuizCreate, QuizResponse, QuizResultCreate, QuizResultResponse
from .flashcard import FlashcardDeckCreate, FlashcardDeckResponse, CardMasteryToggle
from .study_plan import StudyPlanCreate, StudyPlanResponse, BlockCompletionToggle
from .progress import ProgressSummaryResponse

__all__ = [
    "UserCreate", "UserLogin", "UserUpdate", "PasswordChange", "UserResponse", "Token",
    "AIChatRequest", "AIChatResponse", "AISummarizeRequest", "AISummarizeResponse",
    "AIQuizRequest", "AIQuizResponse", "AIFlashcardsRequest", "AIFlashcardsResponse",
    "AIStudyPlanRequest", "AIStudyPlanResponse",
    "NoteCreate", "NoteUpdate", "NoteResponse",
    "QuizCreate", "QuizResponse", "QuizResultCreate", "QuizResultResponse",
    "FlashcardDeckCreate", "FlashcardDeckResponse", "CardMasteryToggle",
    "StudyPlanCreate", "StudyPlanResponse", "BlockCompletionToggle",
    "ProgressSummaryResponse"
]
