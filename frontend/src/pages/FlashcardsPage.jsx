import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Layers, 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  CheckCircle2, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Check, 
  HelpCircle,
  Award,
  BookOpen,
  Volume2
} from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { flashcardsService } from '../services/flashcardsService';
import { aiService } from '../services/aiService';

export const FlashcardsPage = () => {
  const location = useLocation();
  const { success, error, info } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Decks state
  const [decks, setDecks] = useState([]);
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Generator Modal State
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [genSubject, setGenSubject] = useState('Computer Science');
  const [genTopic, setGenTopic] = useState('Data Structures & Algorithms');
  const [genNotesContent, setGenNotesContent] = useState('');
  const [generating, setGenerating] = useState(false);

  // Manual Card Creation Modal State
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');

  // Handle incoming props from Notes page
  useEffect(() => {
    if (location.state?.fromNote) {
      const { subject, topic, content } = location.state.fromNote;
      if (subject) setGenSubject(subject);
      if (topic) setGenTopic(topic);
      if (content) setGenNotesContent(content);
      setGenerateModalOpen(true);
    }
  }, [location.state]);

  // Load Decks
  useEffect(() => {
    const loadDecks = async () => {
      const data = await flashcardsService.getDecks();
      setDecks(data || []);
      if (data && data.length > 0) {
        setActiveDeckId(data[0].id);
      }
    };
    loadDecks();
  }, []);

  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0];
  const cards = activeDeck?.cards || [];
  const currentCard = cards[currentCardIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    if (!activeDeck) return;
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    const updated = { ...activeDeck, cards: shuffledCards };
    flashcardsService.saveDeck(updated).then(() => {
      setDecks(decks.map(d => d.id === activeDeck.id ? updated : d));
      setCurrentCardIndex(0);
      setIsFlipped(false);
      info("Cards shuffled randomly!");
    });
  };

  const handleToggleMastery = async (masteredState) => {
    if (!activeDeck || !currentCard) return;
    const updatedDeck = await flashcardsService.toggleCardMastery(activeDeck.id, currentCard.id, masteredState);
    setDecks(decks.map(d => d.id === activeDeck.id ? updatedDeck : d));
    success(masteredState ? "Marked as Mastered! 🌟" : "Marked for review 📝");
    // Automatically advance to next card
    setTimeout(() => {
      handleNext();
    }, 400);
  };

  const handleGenerateDeck = async (e) => {
    e.preventDefault();
    if (!genTopic.trim()) {
      error("Please enter a topic name.");
      return;
    }
    setGenerating(true);
    try {
      const generated = await aiService.generateFlashcards({
        subject: genSubject,
        topic: genTopic,
        notesContent: genNotesContent,
        cardCount: 6
      });
      await flashcardsService.saveDeck(generated);
      setDecks([generated, ...decks]);
      setActiveDeckId(generated.id);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setGenerateModalOpen(false);
      success("✨ AI Flashcard deck generated successfully!");
    } catch (err) {
      error("Failed to generate flashcards.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAddManualCard = async (e) => {
    e.preventDefault();
    if (!newCardFront.trim() || !newCardBack.trim()) {
      error("Please fill both question and answer.");
      return;
    }
    const newCard = {
      id: `card_${Date.now()}`,
      question: newCardFront.trim(),
      answer: newCardBack.trim(),
      category: activeDeck?.subject || "General",
      mastered: false
    };
    const updatedCards = [...cards, newCard];
    const updatedDeck = {
      ...activeDeck,
      cards: updatedCards,
      cardsCount: updatedCards.length
    };
    await flashcardsService.saveDeck(updatedDeck);
    setDecks(decks.map(d => d.id === activeDeck.id ? updatedDeck : d));
    setNewCardFront('');
    setNewCardBack('');
    setAddCardModalOpen(false);
    success("New card added to deck!");
  };

  const masteredCount = cards.filter(c => c.mastered).length;
  const progressPercent = cards.length > 0 ? Math.round((masteredCount / cards.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header 
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title="Active Recall Flashcards"
          subtitle="Study faster with 3D flip cards, spaced repetition, and Gemini AI"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-8">
          
          {/* Deck Header & Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Deck Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
              {decks.map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    setActiveDeckId(d.id);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                    d.id === activeDeck?.id
                      ? 'bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-600/30'
                      : 'glass-panel border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {d.title} ({d.cards?.length || 0})
                </button>
              ))}
            </div>

            {/* Generator Action */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setGenerateModalOpen(true)}
                icon={Sparkles}
                size="sm"
                className="shadow-lg shadow-brand-600/25"
              >
                AI Generate Deck
              </Button>
              <Button
                onClick={() => setAddCardModalOpen(true)}
                variant="secondary"
                icon={Plus}
                size="sm"
              >
                Add Card
              </Button>
            </div>

          </div>

          {/* Active Deck Study Session */}
          {activeDeck && cards.length > 0 ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              
              {/* Progress & Deck Status Bar */}
              <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400">Card</span>
                  <span className="text-sm font-bold text-white">
                    {currentCardIndex + 1} / {cards.length}
                  </span>
                  {currentCard?.mastered && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Mastered
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Mastery: <strong>{progressPercent}%</strong></span>
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 3D Flip Card Container */}
              <div
                className="w-full min-h-[320px] sm:min-h-[380px] perspective-1000 cursor-pointer select-none"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className={`w-full h-full relative transition-transform duration-500 transform-style-preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  style={{ minHeight: '340px' }}
                >
                  
                  {/* FRONT OF CARD (Question) */}
                  <div className="absolute inset-0 backface-hidden glass-dropdown p-8 sm:p-10 rounded-3xl border border-brand-500/30 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-300 font-semibold border border-brand-500/20">
                        {currentCard?.category || activeDeck.subject}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <RotateCw className="w-3.5 h-3.5 text-brand-400" /> Click anywhere to flip
                      </span>
                    </div>

                    <div className="text-center py-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-2 block">Question</span>
                      <h2 className="text-lg sm:text-2xl font-bold font-display text-white leading-relaxed">
                        {currentCard?.question}
                      </h2>
                    </div>

                    <div className="text-center text-xs text-slate-500">
                      Space / Click to reveal answer
                    </div>
                  </div>

                  {/* BACK OF CARD (Answer & Insight) */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 glass-dropdown p-8 sm:p-10 rounded-3xl border border-accent-500/40 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-accent-500/10 text-accent-300 font-semibold border border-accent-500/20">
                        Answer & Key Concept
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <RotateCw className="w-3.5 h-3.5 text-accent-400" /> Click to flip back
                      </span>
                    </div>

                    <div className="text-center py-6 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-accent-400 block">Correct Answer</span>
                      <p className="text-sm sm:text-lg font-medium text-slate-100 leading-relaxed whitespace-pre-line">
                        {currentCard?.answer}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMastery(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 text-xs font-bold transition-colors"
                      >
                        Needs Review 📝
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMastery(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-lg shadow-emerald-600/30"
                      >
                        Mastered! 🌟
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  onClick={handlePrev}
                  variant="secondary"
                  size="md"
                  icon={ChevronLeft}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleShuffle}
                    variant="ghost"
                    size="sm"
                    icon={Shuffle}
                    title="Shuffle Cards"
                  >
                    Shuffle
                  </Button>
                  <Button
                    onClick={() => setIsFlipped(!isFlipped)}
                    variant="ghost"
                    size="sm"
                    icon={RotateCcw}
                  >
                    Flip
                  </Button>
                </div>

                <Button
                  onClick={handleNext}
                  variant="primary"
                  size="md"
                  icon={ChevronRight}
                >
                  Next Card
                </Button>
              </div>

            </div>
          ) : (
            <div className="text-center py-16 glass-panel rounded-3xl space-y-4 max-w-lg mx-auto">
              <Layers className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Flashcards in this deck</h3>
              <p className="text-xs text-slate-400">Generate a custom deck with AI or add manual flashcards to start studying.</p>
              <Button onClick={() => setGenerateModalOpen(true)} icon={Sparkles}>Generate with Gemini AI</Button>
            </div>
          )}

        </main>
      </div>

      {/* AI Deck Generator Modal */}
      <Modal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        title="✨ Generate Flashcard Deck with Gemini AI"
      >
        <form onSubmit={handleGenerateDeck} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Subject</label>
            <input
              type="text"
              required
              value={genSubject}
              onChange={(e) => setGenSubject(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Topic Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Data Structures Tree Rotations, Organic Chemistry Reagents"
              value={genTopic}
              onChange={(e) => setGenTopic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Paste Notes or Slide Text (Optional)</label>
            <textarea
              rows={4}
              placeholder="Paste raw lecture notes to convert them directly into flashcards..."
              value={genNotesContent}
              onChange={(e) => setGenNotesContent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono"
            />
          </div>

          <Button
            type="submit"
            isLoading={generating}
            icon={Sparkles}
            className="w-full py-3 mt-2"
          >
            Create Flashcard Deck
          </Button>
        </form>
      </Modal>

      {/* Add Manual Card Modal */}
      <Modal
        isOpen={addCardModalOpen}
        onClose={() => setAddCardModalOpen(false)}
        title="Add Single Flashcard"
      >
        <form onSubmit={handleAddManualCard} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Front (Question / Prompt) *</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. What is the time complexity of QuickSort in worst case?"
              value={newCardFront}
              onChange={(e) => setNewCardFront(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Back (Answer & Key Takeaway) *</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. O(n²) when the pivot chosen is consistently the smallest or largest element."
              value={newCardBack}
              onChange={(e) => setNewCardBack(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <Button type="submit" className="w-full py-3">Add to Deck</Button>
        </form>
      </Modal>
    </div>
  );
};
