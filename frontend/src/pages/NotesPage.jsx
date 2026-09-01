import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Sparkles, 
  BookOpen, 
  Trash2, 
  Edit3, 
  Save, 
  FileText, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  Share2, 
  Copy, 
  Tag, 
  ListChecks, 
  Lightbulb, 
  FileCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { notesService } from '../services/notesService';
import { aiService } from '../services/aiService';

export const NotesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error, info } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  
  // Note editing state
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('Computer Science');
  const [editTags, setEditTags] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // AI Summarization Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Parse search query param if any
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    if (q) setSearchQuery(q);
  }, [location.search]);

  // Load notes
  useEffect(() => {
    const fetchNotes = async () => {
      const data = await notesService.getNotes();
      setNotes(data || []);
      if (data && data.length > 0) {
        selectNote(data[0]);
      }
    };
    fetchNotes();
  }, []);

  const selectNote = (note) => {
    setActiveNoteId(note.id);
    setEditTitle(note.title);
    setEditSubject(note.subject || 'General');
    setEditTags(note.tags ? note.tags.join(', ') : '');
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleCreateNewNote = () => {
    const newNote = {
      title: "Untitled Study Note",
      subject: "Computer Science",
      tags: ["Draft"],
      content: `# New Topic\n\nStart typing your lecture notes, formulas, or key concepts here...\n\n### Key Principle:\n- Detail 1\n- Detail 2`
    };
    notesService.createNote(newNote).then((created) => {
      setNotes([created, ...notes]);
      selectNote(created);
      setIsEditing(true);
      success("Created new study note!");
    });
  };

  const handleSaveNote = async () => {
    if (!editTitle.trim()) {
      error("Please give your note a title.");
      return;
    }
    setIsSaving(true);
    const tagsArray = editTags.split(',').map(t => t.trim()).filter(Boolean);
    const updated = await notesService.updateNote(activeNoteId, {
      title: editTitle,
      subject: editSubject,
      tags: tagsArray,
      content: editContent
    });
    setIsSaving(false);
    setIsEditing(false);

    setNotes(notes.map(n => n.id === activeNoteId ? updated : n));
    success("Note saved successfully!");
  };

  const handleDeleteNote = async (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      await notesService.deleteNote(id);
      const remaining = notes.filter(n => n.id !== id);
      setNotes(remaining);
      if (remaining.length > 0) {
        selectNote(remaining[0]);
      } else {
        setActiveNoteId(null);
        setEditTitle('');
        setEditContent('');
      }
      info("Note removed.");
    }
  };

  // AI Tools Handlers
  const handleTriggerAI = async (mode = "all") => {
    if (!editContent.trim()) {
      error("Note content is empty. Add some text first!");
      return;
    }
    setAiLoading(true);
    setAiModalOpen(true);
    try {
      const result = await aiService.summarizeNote(editContent, mode);
      setAiResult(result);
      // Auto-save AI insights onto note
      await notesService.updateNote(activeNoteId, {
        summary: result.summary,
        keyPoints: result.keyPoints,
        keyDefinitions: result.keyDefinitions,
        examPoints: result.examPoints
      });
      // Update local state
      setNotes(notes.map(n => n.id === activeNoteId ? {
        ...n,
        summary: result.summary,
        keyPoints: result.keyPoints,
        keyDefinitions: result.keyDefinitions,
        examPoints: result.examPoints
      } : n));
    } catch (err) {
      error("AI analysis failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleConvertToFlashcards = () => {
    navigate('/flashcards', { state: { fromNote: { subject: editSubject, topic: editTitle, content: editContent } } });
  };

  const handleGenerateQuizFromNote = () => {
    navigate('/quiz', { state: { fromNote: { subject: editSubject, topic: editTitle } } });
  };

  // Filter notes
  const subjects = ['All', ...new Set(notes.map(n => n.subject).filter(Boolean))];
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (n.tags && n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 h-screen">
        <Header 
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title="Smart Notes & AI Tools"
          subtitle="Organize, format, and extract high-yield insights with Gemini AI"
        />

        <div className="flex-1 flex overflow-hidden">
          
          {/* Notes Sidebar / List */}
          <div className="w-80 md:w-96 flex flex-col bg-slate-900/60 border-r border-white/10 p-4 space-y-4">
            
            {/* Action Bar */}
            <div className="flex items-center justify-between gap-2">
              <Button
                onClick={handleCreateNewNote}
                icon={Plus}
                size="sm"
                className="flex-1 text-xs py-2.5"
              >
                New Study Note
              </Button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search notes or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Subject Filters Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {subjects.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSubject(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedSubject === s
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Notes List Scroll */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No matching notes found.
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all space-y-2 group ${
                      note.id === activeNoteId
                        ? 'bg-brand-600/20 border-brand-500/50 shadow-md shadow-brand-500/10'
                        : 'glass-panel border-white/5 hover:border-brand-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-brand-300">
                        {note.title}
                      </h4>
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-1 transition-opacity"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {note.content.replace(/[#*`$\-_]/g, '')}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 font-semibold text-brand-300">
                        {note.subject}
                      </span>
                      <span>{note.summary ? "✨ AI Insights Ready" : "Raw Notes"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Active Note Editor & Viewer */}
          <div className="flex-1 flex flex-col bg-slate-950/80 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
            
            {activeNote ? (
              <>
                {/* Note Header & AI Action Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="space-y-1 flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full text-xl sm:text-2xl font-bold font-display text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-brand-500 focus:outline-none"
                      />
                    ) : (
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                        {activeNote.title}
                      </h2>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-brand-300 font-semibold">{activeNote.subject}</span>
                      <span>•</span>
                      <span>{activeNote.tags?.join(', ') || 'General'}</span>
                    </div>
                  </div>

                  {/* AI Feature Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      onClick={() => handleTriggerAI("all")}
                      variant="primary"
                      size="sm"
                      icon={Sparkles}
                      className="shadow-md shadow-brand-500/25"
                    >
                      AI Summarize & Extract
                    </Button>

                    {isEditing ? (
                      <Button
                        onClick={handleSaveNote}
                        isLoading={isSaving}
                        variant="secondary"
                        size="sm"
                        icon={Save}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="ghost"
                        size="sm"
                        icon={Edit3}
                      >
                        Edit Note
                      </Button>
                    )}
                  </div>
                </div>

                {/* AI Insights Card (if generated) */}
                {(activeNote.summary || activeNote.keyPoints?.length > 0) && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-950/80 via-slate-900 to-accent-950/60 border border-brand-500/40 shadow-xl space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-brand-500/20">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-accent-400" />
                        <span>AI Executive Summary & High-Yield Takeaways</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleConvertToFlashcards}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-brand-600 text-[11px] font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1"
                        >
                          <Layers className="w-3 h-3" /> Convert to Flashcards
                        </button>
                        <button
                          onClick={handleGenerateQuizFromNote}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-brand-600 text-[11px] font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-1"
                        >
                          <HelpCircle className="w-3 h-3" /> Generate Quiz
                        </button>
                      </div>
                    </div>

                    {activeNote.summary && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-brand-500/10 p-3 rounded-xl border border-brand-500/20">
                        "{activeNote.summary}"
                      </p>
                    )}

                    {/* Key Points */}
                    {activeNote.keyPoints?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <ListChecks className="w-3.5 h-3.5 text-emerald-400" /> Key Exam Takeaways
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                          {activeNote.keyPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Note Content Editor or Markdown Reader */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-400 block mb-1">Subject</label>
                          <input
                            type="text"
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-400 block mb-1">Tags (comma separated)</label>
                          <input
                            type="text"
                            value={editTags}
                            onChange={(e) => setEditTags(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1">Note Content (Markdown supported)</label>
                        <textarea
                          rows={16}
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-200 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4">
                      {activeNote.content.split('\n\n').map((para, i) => {
                        if (para.startsWith('# ')) {
                          return <h2 key={i} className="text-xl font-bold font-display text-white border-b border-white/10 pb-2">{para.replace('# ', '')}</h2>;
                        }
                        if (para.startsWith('### ')) {
                          return <h3 key={i} className="text-base font-bold font-display text-brand-300">{para.replace('### ', '')}</h3>;
                        }
                        if (para.startsWith('```')) {
                          const code = para.replace(/```[a-z]*/g, '').replace(/```/g, '');
                          return (
                            <pre key={i} className="p-4 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto">
                              <code>{code.trim()}</code>
                            </pre>
                          );
                        }
                        return <p key={i} className="whitespace-pre-line text-slate-300">{para}</p>;
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
                <FileText className="w-12 h-12" />
                <p>Select a note or create a new one to begin.</p>
                <Button onClick={handleCreateNewNote} icon={Plus}>Create Note</Button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* AI Summarizer Result Modal */}
      <Modal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title="✨ Gemini AI Note Breakdown"
        maxWidth="max-w-2xl"
      >
        {aiLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
            <div className="text-sm font-semibold text-white">Analyzing Note with Gemini AI...</div>
            <p className="text-xs text-slate-400">Extracting definitions, summaries, and exam points</p>
          </div>
        ) : aiResult ? (
          <div className="space-y-6 text-xs sm:text-sm">
            
            {/* Executive Summary */}
            <div className="p-4 rounded-2xl bg-brand-950/60 border border-brand-500/30 space-y-2">
              <div className="font-bold text-brand-300 uppercase tracking-wider text-xs">Summary</div>
              <p className="text-slate-200 leading-relaxed">{aiResult.summary}</p>
            </div>

            {/* Key Definitions */}
            {aiResult.keyDefinitions?.length > 0 && (
              <div className="space-y-2">
                <div className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Essential Definitions Glossary
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {aiResult.keyDefinitions.map((d, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-900 border border-white/5">
                      <span className="font-bold text-brand-300">{d.term}: </span>
                      <span className="text-slate-300">{d.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exam Focused Points */}
            {aiResult.examPoints?.length > 0 && (
              <div className="space-y-2">
                <div className="font-bold text-rose-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-rose-400" /> High-Yield Exam Watchouts
                </div>
                <ul className="space-y-1.5">
                  {aiResult.examPoints.map((ep, i) => (
                    <li key={i} className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-200 flex items-start gap-2">
                      <span>⚠️</span>
                      <span>{ep}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3">
              <Button onClick={() => setAiModalOpen(false)}>Done & Saved to Note</Button>
            </div>

          </div>
        ) : null}
      </Modal>
    </div>
  );
};
