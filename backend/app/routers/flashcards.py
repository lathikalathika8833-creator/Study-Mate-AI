from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.flashcard import FlashcardDeck
from ..schemas.flashcard import FlashcardDeckCreate, FlashcardDeckResponse, CardMasteryToggle

router = APIRouter(prefix="/flashcards", tags=["Flashcards"])

def format_deck_response(deck: FlashcardDeck) -> FlashcardDeckResponse:
    cards = deck.cards or []
    mastered = sum(1 for c in cards if c.get("mastered"))
    return FlashcardDeckResponse(
        id=deck.id,
        title=deck.title,
        subject=deck.subject,
        cardsCount=len(cards),
        masteredCount=mastered,
        cards=cards,
        createdAt=deck.created_at.isoformat() if deck.created_at else None
    )

@router.get("", response_model=List[FlashcardDeckResponse])
def get_decks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    decks = db.query(FlashcardDeck).filter(FlashcardDeck.user_id == current_user.id).order_by(FlashcardDeck.created_at.desc()).all()
    return [format_deck_response(d) for d in decks]

@router.post("", response_model=FlashcardDeckResponse)
def save_deck(
    deck_in: FlashcardDeckCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cards = deck_in.cards or []
    mastered = sum(1 for c in cards if c.get("mastered"))

    existing = None
    if deck_in.id:
        existing = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_in.id, FlashcardDeck.user_id == current_user.id).first()

    if existing:
        existing.title = deck_in.title
        existing.subject = deck_in.subject
        existing.cards = cards
        existing.cards_count = len(cards)
        existing.mastered_count = mastered
        db.commit()
        db.refresh(existing)
        return format_deck_response(existing)

    new_deck = FlashcardDeck(
        id=deck_in.id,
        user_id=current_user.id,
        title=deck_in.title,
        subject=deck_in.subject,
        cards_count=len(cards),
        mastered_count=mastered,
        cards=cards
    )
    db.add(new_deck)
    db.commit()
    db.refresh(new_deck)
    return format_deck_response(new_deck)

@router.get("/{deck_id}", response_model=FlashcardDeckResponse)
def get_deck(
    deck_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deck = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_id, FlashcardDeck.user_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flashcard deck not found")
    return format_deck_response(deck)

@router.patch("/{deck_id}/cards/{card_id}", response_model=FlashcardDeckResponse)
def toggle_card_mastery(
    deck_id: str,
    card_id: str,
    toggle: CardMasteryToggle,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deck = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_id, FlashcardDeck.user_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flashcard deck not found")
    
    cards = deck.cards or []
    updated_cards = []
    for c in cards:
        if c.get("id") == card_id:
            c_copy = dict(c)
            c_copy["mastered"] = toggle.mastered
            updated_cards.append(c_copy)
        else:
            updated_cards.append(c)
    
    deck.cards = updated_cards
    deck.mastered_count = sum(1 for c in updated_cards if c.get("mastered"))
    db.commit()
    db.refresh(deck)
    return format_deck_response(deck)

@router.delete("/{deck_id}")
def delete_deck(
    deck_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    deck = db.query(FlashcardDeck).filter(FlashcardDeck.id == deck_id, FlashcardDeck.user_id == current_user.id).first()
    if not deck:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flashcard deck not found")
    
    db.delete(deck)
    db.commit()
    return {"status": "success", "message": "Flashcard deck deleted"}
