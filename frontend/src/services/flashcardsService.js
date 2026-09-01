import api from './api';
import { initialDecks } from '../data/mockData';

const DECKS_KEY = 'studymate_flashcards';

function getLocalDecks() {
  const cached = localStorage.getItem(DECKS_KEY);
  if (!cached) {
    localStorage.setItem(DECKS_KEY, JSON.stringify(initialDecks));
    return initialDecks;
  }
  try {
    return JSON.parse(cached);
  } catch (e) {
    return initialDecks;
  }
}

function saveLocalDecks(decks) {
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
}

export const flashcardsService = {
  async getDecks() {
    try {
      const res = await api.get('/flashcards');
      return res.data;
    } catch (error) {
      return getLocalDecks();
    }
  },

  async getDeckById(id) {
    try {
      const res = await api.get(`/flashcards/${id}`);
      return res.data;
    } catch (error) {
      const decks = getLocalDecks();
      return decks.find(d => d.id === id) || null;
    }
  },

  async saveDeck(deck) {
    try {
      const res = await api.post('/flashcards', deck);
      return res.data;
    } catch (error) {
      const decks = getLocalDecks();
      const newDeck = {
        ...deck,
        id: deck.id || `deck_${Date.now()}`,
        cardsCount: deck.cards ? deck.cards.length : 0,
        masteredCount: deck.cards ? deck.cards.filter(c => c.mastered).length : 0
      };
      const updated = [newDeck, ...decks.filter(d => d.id !== newDeck.id)];
      saveLocalDecks(updated);
      return newDeck;
    }
  },

  async toggleCardMastery(deckId, cardId, mastered) {
    try {
      const res = await api.patch(`/flashcards/${deckId}/cards/${cardId}`, { mastered });
      return res.data;
    } catch (error) {
      const decks = getLocalDecks();
      const updated = decks.map(deck => {
        if (deck.id === deckId) {
          const newCards = deck.cards.map(c => c.id === cardId ? { ...c, mastered } : c);
          const masteredCount = newCards.filter(c => c.mastered).length;
          return { ...deck, cards: newCards, masteredCount };
        }
        return deck;
      });
      saveLocalDecks(updated);
      return updated.find(d => d.id === deckId);
    }
  },

  async deleteDeck(id) {
    try {
      await api.delete(`/flashcards/${id}`);
      return true;
    } catch (error) {
      const decks = getLocalDecks();
      const updated = decks.filter(d => d.id !== id);
      saveLocalDecks(updated);
      return true;
    }
  }
};
