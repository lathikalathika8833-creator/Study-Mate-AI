from .auth import router as auth_router
from .ai import router as ai_router
from .notes import router as notes_router
from .quizzes import router as quizzes_router
from .flashcards import router as flashcards_router
from .planner import router as planner_router
from .progress import router as progress_router

__all__ = [
    "auth_router",
    "ai_router",
    "notes_router",
    "quizzes_router",
    "flashcards_router",
    "planner_router",
    "progress_router"
]
