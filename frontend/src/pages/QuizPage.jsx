import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Trophy, 
  Clock, 
  BookOpen, 
  Sliders, 
  Award,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Card } from '../components/common/Card';
import { useToast } from '../context/ToastContext';
import { quizService } from '../services/quizService';
import { aiService } from '../services/aiService';

export const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, error, info } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Quizzes list & history
  const [quizzes, setQuizzes] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'playing' | 'results' | 'history'

  // Quiz Generator Form State
  const [genSubject, setGenSubject] = useState('Computer Science');
  const [genTopic, setGenTopic] = useState('Java OOP Polymorphism');
  const [genDifficulty, setGenDifficulty] = useState('Medium');
  const [genCount, setGenCount] = useState(5);
  const [generating, setGenerating] = useState(false);

  // Active Quiz Playing State
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qIndex]: selectedOptionIndex }
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [lastSavedResult, setLastSavedResult] = useState(null);

  // Check navigation state for prefill
  useEffect(() => {
    if (location.state?.fromNote) {
      const { subject, topic } = location.state.fromNote;
      if (subject) setGenSubject(subject);
      if (topic) setGenTopic(topic);
    }
  }, [location.state]);

  // Load quizzes & history
  useEffect(() => {
    const loadQuizzes = async () => {
      const [qList, results] = await Promise.all([
        quizService.getQuizzes(),
        quizService.getQuizResults()
      ]);
      setQuizzes(qList || []);
      setQuizResults(results || []);
    };
    loadQuizzes();
  }, []);

  // Generate Quiz with Gemini AI
  const handleGenerateQuiz = async (e) => {
    e?.preventDefault();
    if (!genTopic.trim()) {
      error("Please provide a topic name.");
      return;
    }

    setGenerating(true);
    try {
      const newQuiz = await aiService.generateQuiz({
        subject: genSubject,
        topic: genTopic,
        difficulty: genDifficulty,
        questionCount: Number(genCount)
      });

      await quizService.saveQuiz(newQuiz);
      setQuizzes([newQuiz, ...quizzes]);
      startQuiz(newQuiz);
      success("✨ AI Quiz generated successfully!");
    } catch (err) {
      error("Failed to generate quiz with AI. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Start Playing a Quiz
  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizCompleted(false);
    setActiveTab('playing');
  };

  // Select Option
  const handleSelectOption = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  // Submit Quiz & Calculate Score
  const handleSubmitQuiz = async () => {
    let correctCount = 0;
    const totalQuestions = currentQuiz.questions.length;

    currentQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    setFinalScore(percentage);
    setQuizCompleted(true);
    setActiveTab('results');

    // Trigger celebration confetti if score >= 80%
    if (percentage >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Save result to service
    const resultObj = {
      quizId: currentQuiz.id,
      quizTitle: currentQuiz.title,
      subject: currentQuiz.subject,
      topic: currentQuiz.topic,
      score: percentage,
      correctCount,
      totalQuestions,
      userAnswers: selectedAnswers,
      completedAt: new Date().toISOString()
    };

    const saved = await quizService.saveQuizResult(resultObj);
    setLastSavedResult(saved);
    setQuizResults([saved, ...quizResults]);
  };

  const currentQ = currentQuiz?.questions?.[currentQuestionIndex];
  const progressPercent = currentQuiz ? Math.round(((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header 
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
          title="AI Quiz Generator & Practice"
          subtitle="Generate tailored multiple-choice tests with Gemini AI and instant scoring"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto space-y-8">
          
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900 border border-white/10 max-w-md">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'generator'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quiz Generator
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Past Quizzes & Results ({quizResults.length})
            </button>
          </div>

          {/* TAB 1: GENERATOR & LIBRARY */}
          {activeTab === 'generator' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: AI Quiz Setup Form */}
              <div className="lg:col-span-1">
                <div className="glass-dropdown p-6 rounded-3xl border border-white/10 shadow-2xl space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                    <Sparkles className="w-5 h-5 text-accent-400" />
                    <h3 className="text-base font-bold font-display text-white">Generate AI Quiz</h3>
                  </div>

                  <form onSubmit={handleGenerateQuiz} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Subject</label>
                      <select
                        value={genSubject}
                        onChange={(e) => setGenSubject(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-brand-500 font-medium"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Operating Systems">Operating Systems</option>
                        <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Physics">Physics</option>
                        <option value="Biology">Biology</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Topic Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Java OOP, Deadlocks, Lagrange Multipliers"
                        value={genTopic}
                        onChange={(e) => setGenTopic(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-brand-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Difficulty</label>
                        <select
                          value={genDifficulty}
                          onChange={(e) => setGenDifficulty(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-brand-500 font-medium"
                        >
                          <option value="Easy">Easy (Basics)</option>
                          <option value="Medium">Medium (Standard)</option>
                          <option value="Hard">Hard (Exam-Level)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Questions</label>
                        <select
                          value={genCount}
                          onChange={(e) => setGenCount(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-brand-500 font-medium"
                        >
                          <option value="4">4 Questions</option>
                          <option value="5">5 Questions</option>
                          <option value="10">10 Questions</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      isLoading={generating}
                      icon={Sparkles}
                      className="w-full py-3 mt-2"
                    >
                      Generate with Gemini AI
                    </Button>
                  </form>
                </div>
              </div>

              {/* Right Column: Pre-made & Saved Quizzes */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-display text-white">Available Practice Quizzes</h3>
                  <span className="text-xs text-slate-400">{quizzes.length} Quizzes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-brand-500/40 transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20">
                            {quiz.subject}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {quiz.difficulty || "Medium"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                          {quiz.title}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{quiz.questions?.length || 5} Questions</span>
                          {quiz.lastScore !== undefined && (
                            <span className="text-emerald-400 font-bold">
                              • Last: {quiz.lastScore}%
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => startQuiz(quiz)}
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs font-bold hover:bg-brand-600 hover:text-white"
                      >
                        Start Quiz Now →
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ACTIVE QUIZ PLAYER (1 Question at a time) */}
          {activeTab === 'playing' && currentQuiz && currentQ && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              
              {/* Quiz Header Bar */}
              <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                    {currentQuiz.subject} • {currentQuiz.topic}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-400">Progress</span>
                    <div className="text-sm font-bold text-white">{progressPercent}%</div>
                  </div>
                  <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Question Card */}
              <div className="glass-dropdown p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl space-y-6">
                
                <h2 className="text-lg sm:text-xl font-bold font-display text-white leading-relaxed">
                  {currentQ.question}
                </h2>

                {/* 4 Options Grid */}
                <div className="space-y-3">
                  {currentQ.options.map((optionText, optIndex) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIndex;
                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelectOption(optIndex)}
                        className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-brand-600/30 border-brand-500 text-white shadow-md shadow-brand-500/20'
                            : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isSelected
                                ? 'bg-brand-500 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </div>
                          <span>{optionText}</span>
                        </div>

                        {isSelected && <Check className="w-5 h-5 text-brand-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <Button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    variant="ghost"
                    size="sm"
                    icon={ArrowLeft}
                  >
                    Previous
                  </Button>

                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    variant="primary"
                    size="md"
                    className="shadow-lg shadow-brand-600/30"
                  >
                    {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
                      "Submit Quiz & View Results"
                    ) : (
                      <>
                        <span>Next Question</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: RESULTS BREAKDOWN & EXPLANATIONS */}
          {activeTab === 'results' && currentQuiz && (
            <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
              
              {/* Score Showcase Card */}
              <div className="rounded-3xl p-8 bg-gradient-to-br from-brand-950 via-slate-900 to-accent-950 border border-brand-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center mx-auto text-white shadow-xl shadow-brand-500/30">
                  <Trophy className="w-10 h-10" />
                </div>

                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    {finalScore >= 80 ? "Outstanding Mastery! 🌟" : finalScore >= 60 ? "Good Job! Keep Practicing 👍" : "Needs Review 📚"}
                  </h2>
                  <p className="text-sm text-slate-300 mt-1">
                    You scored <strong className="text-brand-300 text-lg">{finalScore}%</strong> on {currentQuiz.title}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <Button
                    onClick={() => startQuiz(currentQuiz)}
                    variant="secondary"
                    size="sm"
                    icon={RotateCcw}
                  >
                    Retake Quiz
                  </Button>
                  <Button
                    onClick={() => setActiveTab('generator')}
                    variant="primary"
                    size="sm"
                  >
                    Create Another Quiz
                  </Button>
                </div>
              </div>

              {/* Detailed Breakdown & Explanations */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display text-white">Question Review & AI Explanations</h3>
                
                {currentQuiz.questions.map((q, idx) => {
                  const userChoice = selectedAnswers[idx];
                  const isCorrect = userChoice === q.correctAnswer;
                  return (
                    <div
                      key={idx}
                      className={`glass-panel p-6 rounded-3xl border space-y-4 ${
                        isCorrect ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-rose-500/30 bg-rose-950/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-bold text-white">
                          <span className="text-slate-400">Q{idx + 1}: </span> {q.question}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {isCorrect ? (
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-rose-400 bg-rose-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Options breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isAnswer = oIdx === q.correctAnswer;
                          const wasChosen = oIdx === userChoice;
                          return (
                            <div
                              key={oIdx}
                              className={`p-3 rounded-xl border flex items-center justify-between ${
                                isAnswer
                                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-semibold'
                                  : wasChosen
                                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 line-through'
                                  : 'bg-slate-900/60 border-white/5 text-slate-400'
                              }`}
                            >
                              <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                              {isAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-brand-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-accent-400" /> Explanation:
                        </span>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 4: PAST QUIZ HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold font-display text-white">Quiz Performance History</h3>
              {quizResults.length === 0 ? (
                <div className="text-center py-12 glass-panel rounded-3xl text-slate-500 text-xs">
                  No completed quizzes yet. Complete a quiz to track your history!
                </div>
              ) : (
                <div className="space-y-3">
                  {quizResults.map((res, i) => (
                    <div
                      key={i}
                      className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-300">
                          {res.subject}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{res.quizTitle || res.topic}</h4>
                        <div className="text-xs text-slate-400">
                          {new Date(res.completedAt).toLocaleDateString()} • {res.correctCount || 0} / {res.totalQuestions || 5} Correct
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold font-display text-emerald-400">
                          {res.score}%
                        </div>
                        <span className="text-[10px] text-slate-400">Final Score</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
