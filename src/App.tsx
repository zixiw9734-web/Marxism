/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  BookText, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X, 
  Eye, 
  EyeOff,
  RotateCcw,
  Star,
  Info,
  Library,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DATA, CHAPTERS, KnowledgePoint, CHAPTER_QUESTIONS, ReviewQuestion } from "./content";

type Mode = "browse" | "recitation" | "card" | "search" | "questions";

// --- Sub-components ---

/**
 * Review Question Card
 */
const QuestionCard: React.FC<{ item: ReviewQuestion }> = ({ item }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <motion.div 
      layout
      className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all mb-8 overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black">
          Q
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chapter Review Inquiry</span>
      </div>

      <div className="text-xl font-serif font-black text-slate-900 leading-relaxed whitespace-pre-wrap mb-8 antialiased">
        {item.question}
      </div>

      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
          showAnswer ? "bg-slate-100 text-slate-500" : "bg-primary text-white shadow-lg shadow-red-900/20 hover:-translate-y-0.5 active:scale-95"
        }`}
      >
        {showAnswer ? <EyeOff size={14} /> : <Eye size={14} />}
        {showAnswer ? "Hide Elaborated Answer" : "Reveal Review Synthesis"}
      </button>

      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-8 mt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-secondary/20 text-yellow-700 rounded-lg flex items-center justify-center font-black text-xs">
                  A
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Theoretical Synthesis</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-serif italic text-lg whitespace-pre-wrap antialiased">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * Knowledge Card for Browse & Recitation Modes
 */
const KnowledgeCard = ({ point, displayIndex, hideInitial = false }: { point: KnowledgePoint; displayIndex?: number; hideInitial?: boolean }) => {
  const [showContent, setShowContent] = useState(!hideInitial);

  useEffect(() => {
    setShowContent(!hideInitial);
  }, [point.id, hideInitial]);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all mb-5 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          {displayIndex && (
            <span className="text-[10px] font-black p-1 px-3 rounded-lg bg-primary text-white shadow-sm">
              Point {displayIndex}
            </span>
          )}
        </div>
        <button 
          onClick={() => setShowContent(!showContent)}
          className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all scale-90 hover:scale-100"
        >
          {showContent ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <h3 className="font-serif font-black text-xl text-slate-900 mb-2 leading-tight pr-10">{point.title}</h3>
      
      <AnimatePresence mode="wait">
        {showContent ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap pt-4 mt-2 border-t border-slate-50 font-serif italic antialiased">
              {point.content}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-4 cursor-pointer"
            onClick={() => setShowContent(true)}
          >
            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-slate-200/50" 
                animate={{ x: ["-100%", "100%"] }} 
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Decorative background embellishment */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
        <BookOpen size={100} />
      </div>
    </motion.div>
  );
};

/**
 * Flashcard for Interactive Card Mode
 */
const Flashcard = ({ point, onNext, onPrev, current, total }: { 
  point: KnowledgePoint; 
  onNext: () => void; 
  onPrev: () => void; 
  current: number; 
  total: number 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [point.id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] max-w-xl mx-auto w-full px-6 py-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
          {point.chapter}
        </div>
        <div className="text-xs font-serif text-slate-400 italic">Sequential Entry {current + 1} of {total}</div>
      </div>

      <div 
        className="w-full relative h-[420px] perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div 
          className="w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 25 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-[3rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-12 flex flex-col items-center justify-center border border-slate-100 group-hover:border-slate-300 transition-colors">
            <div className="mb-10 w-12 h-12 rounded-2xl flex items-center justify-center bg-primary/10 text-primary">
              <Star fill="currentColor" size={24} />
            </div>
            <h3 className="text-3xl font-serif font-black text-slate-900 text-center leading-tight">{point.title}</h3>
            <p className="mt-16 text-[10px] text-slate-300 font-black uppercase tracking-[0.3em] group-hover:text-slate-500 transition-colors">Click to reveal answer</p>
          </div>
          
          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-primary rounded-[3rem] shadow-2xl p-12 flex flex-col items-center justify-center rotate-y-180 border border-red-800 overflow-y-auto">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-orange-500 opacity-50" />
            <div className="text-white/20 text-[10px] font-black mb-6 tracking-widest uppercase border border-white/10 px-3 py-1 rounded-full">Theoretical Insight</div>
            <p className="text-slate-100 text-xl leading-relaxed text-center font-serif italic selection:bg-white selection:text-slate-900">
              {point.content}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-8 mt-12">
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="p-5 rounded-full bg-white text-slate-400 border border-slate-200 shadow-sm hover:text-slate-900 hover:border-slate-900 transition-all active:scale-95"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="px-12 py-5 rounded-full bg-primary text-white font-bold shadow-xl hover:bg-red-700 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 tracking-tight"
        >
          Next Mastery
          <ChevronRight size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

// --- Main App ---

export default function App() {
  const [activeChapter, setActiveChapter] = useState<string>("导论");
  const [mode, setMode] = useState<Mode>("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  // Computed data
  const chapterPoints = useMemo(() => {
    return DATA.filter(p => p.chapter === activeChapter).sort((a, b) => a.index - b.index);
  }, [activeChapter]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return DATA.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
  }, [searchQuery]);

  const totalPoints = DATA.length;

  const chapterQuestions = useMemo(() => {
    return CHAPTER_QUESTIONS.filter(q => q.chapter === activeChapter);
  }, [activeChapter]);

  // Mode content renderer
  const renderModeContent = () => {
    switch (mode) {
      case "questions":
        return (
          <div className="max-w-3xl mx-auto py-12 px-6">
            <header className="mb-16 relative">
              <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-secondary rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)]" />
              <h2 className="text-4xl font-serif font-black text-slate-900 mb-4 leading-tight tracking-tight">思考与复习 <span className="text-primary italic">Inquiry</span></h2>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-1.5 text-primary"><Info size={12} /> Analytical Synthesis</span>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                <span>Chapter Reflection Task</span>
              </div>
            </header>

            <div className="space-y-4">
              {chapterQuestions.map((q) => (
                <QuestionCard key={q.id} item={q} />
              ))}
              {chapterQuestions.length === 0 && (
                <div className="text-center py-40 flex flex-col items-center gap-6 opacity-20">
                  <RotateCcw size={64} strokeWidth={1} />
                  <p className="italic font-serif text-xl">Review synthesis for this chapter is pending registration.</p>
                </div>
              )}
            </div>
          </div>
        );
      case "browse":
      case "recitation":
        return (
          <div className="max-w-3xl mx-auto py-12 px-6">
            <header className="mb-16 relative">
              <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(185,28,28,0.3)]" />
              <h2 className="text-4xl font-serif font-black text-primary mb-4 leading-tight tracking-tight">{activeChapter}</h2>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span className="flex items-center gap-1.5"><Library size={12} className="text-secondary" /> Knowledge Vault</span>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                <span>{chapterPoints.length} Essential Entries</span>
              </div>
            </header>
            
            {chapterPoints.length > 0 ? (
              <div className="space-y-8">
                {chapterPoints.map((p) => (
                  <div key={p.id} className="relative group/num">
                    <div className="absolute -left-14 xl:-left-16 top-8 w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xs font-black text-slate-400 group-hover/num:bg-primary group-hover/num:text-white group-hover/num:border-primary group-hover/num:shadow-lg transition-all hidden lg:flex">
                      {p.index}
                    </div>
                    <KnowledgeCard point={p} displayIndex={p.index} hideInitial={mode === "recitation"} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 flex flex-col items-center gap-6 opacity-20">
                <BookOpen size={64} strokeWidth={1} />
                <p className="italic font-serif text-xl">Selected chapter is currently empty in this vault.</p>
              </div>
            )}
          </div>
        );

      case "card":
        return (
          <div className="py-12">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeChapter + cardIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {chapterPoints.length > 0 ? (
                  <Flashcard 
                    point={chapterPoints[cardIndex]} 
                    current={cardIndex}
                    total={chapterPoints.length}
                    onNext={() => setCardIndex((cardIndex + 1) % chapterPoints.length)}
                    onPrev={() => setCardIndex((cardIndex - 1 + chapterPoints.length) % chapterPoints.length)}
                  />
                ) : (
                  <div className="text-center py-40 text-slate-400 italic flex flex-col items-center gap-4">
                     <RotateCcw size={48} className="opacity-20" />
                     <span>No cards available for this chapter.</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        );

      case "search":
        return (
          <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="relative mb-16">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" size={24} strokeWidth={2.5} />
              <input 
                autoFocus
                placeholder="本地检索师：寻章摘句..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-20 bg-white/80 backdrop-blur-md border-2 border-slate-100 rounded-[2.5rem] pl-16 pr-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] focus:border-primary focus:shadow-2xl focus:shadow-red-900/10 focus:ring-0 transition-all font-serif font-bold text-xl text-slate-900 italic outline-none relative z-10"
              />
            </div>
            
            {searchQuery ? (
              <div className="space-y-8">
                <div className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[.3em] flex items-center gap-2">
                  <div className="w-8 h-px bg-slate-200" />
                  Found {searchResults.length} relevant fragments
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                {searchResults.map(p => (
                  <div key={p.id} className="relative group">
                    <div className="absolute -left-4 top-0 bottom-0 w-1.5 bg-slate-100 group-hover:bg-primary transition-all rounded-full" />
                    <KnowledgeCard point={p} />
                    <div className="absolute top-4 right-12 text-[9px] font-black text-slate-300 uppercase tracking-widest pointer-events-none group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <ChevronRight size={10} strokeWidth={3} /> {p.chapter}
                    </div>
                  </div>
                ))}
                {searchResults.length === 0 && (
                  <div className="text-center py-24 opacity-20 flex flex-col items-center gap-4">
                    <Search size={64} strokeWidth={1} />
                    <p className="font-serif italic text-xl">"No echo found for your query in this philosophy."</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 opacity-[0.06]">
                <Library size={160} strokeWidth={0.5} />
                <p className="font-serif italic text-3xl mt-8 tracking-wider">Awaiting inquiry...</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans antialiased bg-marble">
      
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-100 h-20">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 -ml-3 text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-3 group pointer-events-none select-none">
              <div className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl transform transition-all group-hover:rotate-6 group-hover:scale-110">
                <BookText size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <h1 className="font-serif font-black text-xl italic leading-none tracking-tight text-primary">MARXISM GUIDE</h1>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Foundations of Principles</span>
              </div>
            </div>
          </div>

          <nav className="flex items-center bg-slate-100 p-1.5 rounded-[1.25rem] shadow-inner scale-90 sm:scale-100">
            {(["browse", "recitation", "card", "questions", "search"] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setCardIndex(0); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[0.9rem] text-[10px] font-black uppercase tracking-wider transition-all ${
                  mode === m ? "bg-white text-primary shadow-md shadow-slate-200/50 scale-105" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {m === "browse" && <BookText size={12} strokeWidth={3} />}
                {m === "recitation" && <Layers size={12} strokeWidth={3} />}
                {m === "card" && <RotateCcw size={12} strokeWidth={3} />}
                {m === "questions" && <Star size={12} strokeWidth={3} />}
                {m === "search" && <Search size={12} strokeWidth={3} />}
                <span className="hidden sm:inline">
                  {m === "browse" ? "阅读" : m === "recitation" ? "背诵" : m === "card" ? "卡片" : m === "questions" ? "思考题" : "检索"}
                </span>
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>2023 CORE EDITION</span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-start gap-8 lg:gap-16 pt-8 pb-32">
        
        {/* Sidebar Nav (Desktop/Tablet) */}
        <aside className="hidden lg:block w-72 h-[calc(100vh-8rem)] sticky top-28 overflow-y-auto pr-4 no-scrollbar hover:pr-2 transition-all">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[.3em] mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <span>章节目录 Index</span>
            <Layers size={12} className="text-primary" />
          </div>
          <div className="space-y-3">
            {CHAPTERS.map(item => {
              const isActive = activeChapter === item;
              return (
                <button
                  key={item}
                  onClick={() => {
                    setActiveChapter(item);
                    setCardIndex(0);
                    // Smooth scroll to top when changing chapters on tablet
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-5 py-5 rounded-[1.75rem] transition-all flex items-center justify-between group relative overflow-hidden ${
                    isActive 
                    ? "bg-primary text-white shadow-xl shadow-red-900/15 translate-x-1" 
                    : "bg-white border border-slate-100/80 text-slate-500 hover:border-primary/30 hover:text-primary hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  <span className="text-[13px] font-serif font-black italic leading-tight pr-4 z-10">{item}</span>
                  <ChevronRight 
                    size={16} 
                    strokeWidth={3}
                    className={`transition-all z-10 flex-shrink-0 ${isActive ? "translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} 
                  />
                </button>
              );
            })}
          </div>
          
          <div className="mt-10 p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
            <h4 className="font-serif font-black italic text-xl mb-3 relative z-10">学而时习之</h4>
            <p className="text-[10px] leading-relaxed text-slate-300 font-bold uppercase tracking-widest opacity-80 relative z-10">
              马克思主义基本原理是关于自然、社会和人类思维发展一般规律的学说。
            </p>
            <div className="absolute -bottom-6 -right-6 opacity-20 rotate-12 text-primary group-hover:scale-125 transition-transform duration-700">
              <Star size={100} strokeWidth={1} fill="currentColor" />
            </div>
          </div>
        </aside>

        {/* Dynamic Display Area */}
        <main className="flex-1 min-h-[70vh] bg-white rounded-[3rem] sm:rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
          {renderModeContent()}
        </main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-80 bg-[#fafaf9] z-[60] p-8 lg:hidden shadow-[30px_0_60px_-15px_rgba(0,0,0,0.3)] flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                    <Layers size={16} strokeWidth={3} />
                  </div>
                  <h3 className="font-serif font-black italic text-2xl">Navigation</h3>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm"><X size={20} /></button>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                {CHAPTERS.map(item => {
                  const isActive = activeChapter === item;
                  return (
                    <button
                      key={item}
                      onClick={() => {
                        setActiveChapter(item);
                        setIsSidebarOpen(false);
                        setCardIndex(0);
                      }}
                      className={`w-full text-left px-6 py-5 rounded-[1.75rem] font-serif font-bold text-sm italic transition-all ${
                        isActive ? "bg-primary text-white shadow-xl scale-[1.02]" : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Ultra-Discreet Progress Badge */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="w-10 h-10 bg-white/40 backdrop-blur-md border border-slate-200 rounded-full shadow-sm flex items-center justify-center cursor-help hover:w-32 hover:bg-white/95 hover:shadow-xl transition-all duration-500 overflow-hidden group">
          <div className="min-w-[40px] flex items-center justify-center">
             <span className="text-[10px] font-black text-slate-400 group-hover:text-primary transition-colors">
               {totalPoints}
             </span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 flex flex-col whitespace-nowrap pr-4 transition-opacity duration-300">
            <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Mastery Progress</span>
            <span className="text-[10px] font-black text-slate-900 tracking-tighter">Knowledge Vault</span>
          </div>
        </div>
      </div>
    </div>
  );
}
