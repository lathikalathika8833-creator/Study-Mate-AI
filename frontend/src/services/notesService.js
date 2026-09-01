import api from './api';
import { initialNotes } from '../data/mockData';

const STORAGE_KEY = 'studymate_notes';

function getLocalNotes() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (!cached) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotes));
    return initialNotes;
  }
  try {
    return JSON.parse(cached);
  } catch (e) {
    return initialNotes;
  }
}

function saveLocalNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export const notesService = {
  async getNotes() {
    try {
      const res = await api.get('/notes');
      return res.data;
    } catch (error) {
      return getLocalNotes();
    }
  },

  async getNoteById(id) {
    try {
      const res = await api.get(`/notes/${id}`);
      return res.data;
    } catch (error) {
      const notes = getLocalNotes();
      return notes.find(n => n.id === id) || null;
    }
  },

  async createNote(note) {
    try {
      const res = await api.post('/notes', note);
      return res.data;
    } catch (error) {
      const notes = getLocalNotes();
      const newNote = {
        ...note,
        id: `note_${Date.now()}`,
        updatedAt: new Date().toISOString(),
        tags: note.tags || ["General"],
        summary: note.summary || "",
        keyPoints: note.keyPoints || [],
        keyDefinitions: note.keyDefinitions || [],
        examPoints: note.examPoints || []
      };
      const updated = [newNote, ...notes];
      saveLocalNotes(updated);
      return newNote;
    }
  },

  async updateNote(id, updates) {
    try {
      const res = await api.put(`/notes/${id}`, updates);
      return res.data;
    } catch (error) {
      const notes = getLocalNotes();
      const updated = notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n);
      saveLocalNotes(updated);
      return updated.find(n => n.id === id);
    }
  },

  async deleteNote(id) {
    try {
      await api.delete(`/notes/${id}`);
      return true;
    } catch (error) {
      const notes = getLocalNotes();
      const updated = notes.filter(n => n.id !== id);
      saveLocalNotes(updated);
      return true;
    }
  }
};
