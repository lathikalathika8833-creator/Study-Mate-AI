import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Volume2, 
  Plus, 
  Trash2, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  Code, 
  ArrowRight,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { aiService } from '../services/aiService';
import { notesService } from '../services/notesService';
import { initialChatSessions } from '../data/mockData';

export const ChatPage = () => {
  const { user } = useAuth();
  const { success, error, info } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('studymate_chat_sessions');
    return saved ? JSON.parse(saved) : initialChatSessions;
  });
  const [currentSessionId, setCurrentSessionId] = useState(sessions[0]?.id || 'session_1');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [tutorPersona, setTutorPersona] = useState('Socratic & Step-by-Step');
  const messagesEndRef = useRef(null);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  useEffect(() => {
    localStorage.setItem('studymate_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, loading]);

  const suggestedPrompts = [
    { label: "Explain this in simple words", icon: Lightbulb, prompt: "Explain this concept in simple words with a relatable analogy:" },
    { label: "Give me an example", icon: Code, prompt: "Give me a clear, concrete example with code or step-by-step numbers for:" },
    { label: "Teach me step by step", icon: BookOpen, prompt: "Teach me step-by-step from scratch like a patient tutor:" },
    { label: "Create exam notes", icon: Sparkles, prompt: "Create high-yield exam cheat-sheet notes and traps to avoid on:" },
    { label: "Quiz me on this topic", icon: HelpCircle, prompt: "Quiz me with 3 challenging questions to test my understanding on:" }
  ];

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `user_msg_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    // Update session with user message
    const updatedSessions = sessions.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [...s.messages, userMsg],
          title: s.messages.length === 0 ? text.slice(0, 30) + '...' : s.title
        };
      }
      return s;
    });
    setSessions(updatedSessions);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await aiService.chatWithAI(text, { tutorPersona, userMajor: user?.major });
      const aiMsg = {
        id: `ai_msg_${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: response.timestamp || new Date().toISOString()
      };

      setSessions(prevSessions =>
        prevSessions.map(s =>
          s.id === currentSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s
        )
      );
    } catch (err) {
      error("Could not reach AI Tutor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = () => {
    const newSession = {
      id: `session_${Date.now()}`,
      title: "New AI Study Chat",
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `welcome_${Date.now()}`,
          sender: "ai",
          text: `👋 **Hi ${user?.name ? user.name.split(' ')[0] : 'there'}!** I'm your AI Study Buddy.\n\nAsk me anything you're studying—whether it's debugging a tough algorithm, explaining organic chemistry reaction mechanisms, or breaking down multivariable calculus equations.\n\n*Choose a suggested prompt below or type your question to begin!*`
        }
      ]
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    success("New study session started!");
  };

  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      info("Cannot delete the only chat session.");
      return;
    }
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (currentSessionId === id) {
      setCurrentSessionId(filtered[0].id);
    }
    info("Chat session removed.");
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const plainText = text.replace(/[*#`$\-_]/g, '');
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      info("Reading aloud with audio synthesis...");
    } else {
      info("Speech synthesis not supported in this browser.");
    }
  };

  const handleSaveToNotes = async (text) => {
    const newNote = {
      title: `AI Note: ${currentSession.title}`,
      subject: "AI Study Chat",
      content: text,
      tags: ["AI Chat", "Study Notes"]
    };
    await notesService.createNote(newNote);
    success("Saved chat explanation to your Notes library!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 h-screen">
        <Header 
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title="AI Study Chat"
          subtitle="Your personal 24/7 Socratic AI Tutor powered by Gemini"
        />

        <div className="flex-1 flex overflow-hidden">
          
          {/* Chat Sessions Sidebar (Desktop) */}
          <div className="hidden md:flex w-72 flex-col bg-slate-900/60 border-r border-white/10 p-4 space-y-4">
            
            <button
              onClick={handleNewSession}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>New Study Chat</span>
            </button>

            {/* Tutor Style Selector */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Tutor Persona Style
              </label>
              <select
                value={tutorPersona}
                onChange={(e) => setTutorPersona(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-brand-300 focus:outline-none focus:border-brand-500 font-medium"
              >
                <option value="Socratic & Step-by-Step">Socratic & Step-by-Step</option>
                <option value="Simple Words (ELIF5)">Simple Words & Analogies</option>
                <option value="Exam Cheat-Sheet Mode">Exam Cheat-Sheet Mode</option>
                <option value="Rigorous Academic">Rigorous Academic Deep-Dive</option>
              </select>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Recent Chats
              </div>
              {sessions.map(s => (
                <div
                  key={s.id}
                  onClick={() => setCurrentSessionId(s.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all ${
                    s.id === currentSessionId
                      ? 'bg-brand-600/20 text-brand-200 border border-brand-500/40 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{s.title || "Study Session"}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-1 transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Chat Window & Conversation View */}
          <div className="flex-1 flex flex-col bg-slate-950/80 relative overflow-hidden">
            
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {currentSession?.messages.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 sm:gap-4 max-w-4xl mx-auto ${
                      isAI ? 'items-start' : 'items-start flex-row-reverse'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                        isAI
                          ? 'bg-gradient-to-tr from-brand-600 to-accent-600 text-white'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isAI ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`flex-1 rounded-2xl p-4 sm:p-5 border text-sm leading-relaxed shadow-lg ${
                        isAI
                          ? 'glass-panel border-white/10 text-slate-200 bg-slate-900/80'
                          : 'bg-brand-600/25 border-brand-500/40 text-white max-w-xl ml-auto'
                      }`}
                    >
                      {/* Markdown-like formatting rendering */}
                      <div className="space-y-2 prose prose-invert max-w-none text-slate-200">
                        {msg.text.split('\n\n').map((paragraph, i) => {
                          if (paragraph.startsWith('### ')) {
                            return <h3 key={i} className="text-base font-bold text-white font-display mt-2">{paragraph.replace('### ', '')}</h3>;
                          }
                          if (paragraph.startsWith('```')) {
                            const codeContent = paragraph.replace(/```[a-z]*/g, '').replace(/```/g, '');
                            return (
                              <pre key={i} className="p-3 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-brand-300 overflow-x-auto my-2">
                                <code>{codeContent.trim()}</code>
                              </pre>
                            );
                          }
                          if (paragraph.startsWith('> ')) {
                            return (
                              <blockquote key={i} className="border-l-2 border-brand-400 pl-3 italic text-brand-200 bg-brand-500/10 py-1.5 rounded-r-lg">
                                {paragraph.replace('> ', '')}
                              </blockquote>
                            );
                          }
                          return <p key={i} className="whitespace-pre-line">{paragraph}</p>;
                        })}
                      </div>

                      {/* AI Action toolbar (copy, voice, save) */}
                      {isAI && (
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-3 text-xs text-slate-400">
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="flex items-center gap-1.5 hover:text-white transition-colors"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={() => handleSpeakText(msg.text)}
                            className="flex items-center gap-1.5 hover:text-white transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </button>
                          <button
                            onClick={() => handleSaveToNotes(msg.text)}
                            className="flex items-center gap-1.5 hover:text-brand-300 transition-colors ml-auto text-brand-400"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Save to Notes</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading Thinking State */}
              {loading && (
                <div className="flex gap-3 sm:gap-4 max-w-4xl mx-auto items-start">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-600 text-white flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="glass-panel p-4 rounded-2xl border border-brand-500/30 flex items-center gap-3 text-xs text-brand-300">
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-400" />
                    <span>AI Tutor is structuring a tailored explanation...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Bar */}
            <div className="px-4 sm:px-6 pt-2 pb-1 max-w-4xl mx-auto w-full">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {suggestedPrompts.map((sp, idx) => {
                  const Icon = sp.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sp.prompt)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-brand-600/30 border border-white/10 hover:border-brand-500/40 text-slate-300 hover:text-white text-xs font-medium transition-all"
                    >
                      <Icon className="w-3.5 h-3.5 text-brand-400" />
                      <span>{sp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-white/10 backdrop-blur-xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="max-w-4xl mx-auto flex items-center gap-3"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Ask a question or paste a problem (e.g., 'How does Dijkstra algorithm work with Min-Heap?')..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={loading}
                    className="w-full py-3.5 pl-4 pr-12 rounded-2xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all"
                  />
                  <div className="absolute right-3 top-3 text-[10px] text-slate-500 hidden sm:block">
                    Press Enter ↵
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-600/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
