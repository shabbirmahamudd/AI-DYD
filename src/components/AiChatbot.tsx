import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  Bot,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TextFadeSwitch } from './motion/MotionPrimitives';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

function renderFormattedText(text: string) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;
        const segments = trimmed.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-[13px] break-words">
            {segments.map((seg, idx) =>
              seg.startsWith('**') && seg.endsWith('**') ? (
                <strong key={idx} className="font-semibold">
                  {seg.slice(2, -2)}
                </strong>
              ) : (
                <React.Fragment key={idx}>{seg}</React.Fragment>
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}

export function AiChatbot() {
  const { lang, bundle, navigate } = useApp();
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const brandName = bundle.siteContent.brandName || 'DYD AI';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const starterPrompts =
    lang === 'bn'
      ? [
          'কোর্স ও প্রশিক্ষণ মডিউলগুলো কী কী?',
          'ভর্তি আবেদনের যোগ্যতা ও প্রক্রিয়া বলুন',
          'গাইবান্ধা প্রশিক্ষণ কেন্দ্রের ঠিকানা কোথায়?',
          'অ্যাডমিট কার্ড ও সার্টিফিকেট কীভাবে পাবো?',
        ]
      : [
          'What AI courses & modules are offered?',
          'What are the admission steps & eligibility?',
          'Where is the Gaibandha training center?',
          'How do I verify a certificate or get an admit card?',
        ];

  const sendMessage = async (rawText: string) => {
    const clean = rawText.trim();
    if (!clean || loading) return;
    setError('');

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: clean,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          messages: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to reach AI assistant.');
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: String(data.reply || ''),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate response.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 no-print">
      <AnimatePresence>
        {open && (
          <motion.section
            aria-label="DYD AI Assistant Chat"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 w-[calc(100vw-2.5rem)] sm:w-[395px] h-[520px] max-h-[78vh] bg-white border border-emerald-900/15 rounded-3xl shadow-[0_24px_60px_rgba(9,42,32,0.22)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#092A20] via-[#006A4E] to-[#0E805F] text-white px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0 relative">
                  <Bot className="w-5 h-5 text-emerald-100" />
                  <span
                    aria-hidden="true"
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#D92B2B] border border-white"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-sm font-bold truncate">
                    <TextFadeSwitch textKey={`chat-title-${lang}`}>
                      {lang === 'bn' ? `${brandName} সহায়ক` : `${brandName} Assistant`}
                    </TextFadeSwitch>
                  </h2>
                  <p className="text-[11px] text-emerald-100/90 truncate">
                    {lang === 'bn'
                      ? 'কোর্স, ভর্তি ও কেন্দ্র সংক্রান্ত তথ্য'
                      : 'Courses, admissions & portal guide'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setMessages([]);
                      setError('');
                    }}
                    title={lang === 'bn' ? 'নতুন চ্যাট' : 'Clear chat'}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close AI Chatbot"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F8F6]">
              {messages.length === 0 ? (
                <div className="space-y-4 py-2">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006A4E]">
                      <Sparkles className="w-3.5 h-3.5 text-[#D92B2B]" />
                      {lang === 'bn' ? 'স্বাগতম!' : 'Welcome to DYD AI'}
                    </div>
                    <p className="text-xs text-[#526860] leading-relaxed">
                      {lang === 'bn'
                        ? 'ভর্তি আবেদন, প্রশিক্ষণ মডিউল, গাইবান্ধা ল্যাব বা সার্টিফিকেট যাচাই সম্পর্কে বাংলা বা ইংরেজিতে যেকোনো প্রশ্ন করুন।'
                        : 'Ask me anything in English or Bangla about DYD AI training modules, admission steps, Gaibandha lab center, or verification.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-[#526860] px-1">
                      {lang === 'bn' ? 'দ্রুত প্রশ্নসমূহ' : 'Quick Questions'}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {starterPrompts.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => sendMessage(q)}
                          className="text-left text-xs font-medium text-[#092A20] bg-white hover:bg-emerald-50 border border-slate-200 hover:border-[#006A4E]/40 rounded-xl px-3.5 py-2.5 transition-colors cursor-pointer"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                        msg.role === 'user'
                          ? 'bg-[#006A4E] text-white rounded-br-sm'
                          : 'bg-white border border-slate-200 text-[#0F241D] rounded-bl-sm'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-[13px] leading-relaxed break-words">{msg.text}</p>
                      ) : (
                        renderFormattedText(msg.text)
                      )}
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006A4E] animate-bounce [animation-delay:-0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006A4E] animate-bounce [animation-delay:-0.1s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D92B2B] animate-bounce" />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Quick Portal Shortcut Strip */}
            <div className="px-4 py-1.5 bg-white border-t border-slate-100 flex items-center gap-3 overflow-x-auto text-[11px] font-semibold text-[#006A4E]">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate('/apply');
                }}
                className="hover:text-[#D92B2B] whitespace-nowrap transition-colors"
              >
                {lang === 'bn' ? 'আবেদন ফরম →' : 'Apply →'}
              </button>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate('/admit-card');
                }}
                className="hover:text-[#D92B2B] whitespace-nowrap transition-colors"
              >
                {lang === 'bn' ? 'অ্যাডমিট কার্ড →' : 'Admit Card →'}
              </button>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate('/verify-certificate');
                }}
                className="hover:text-[#D92B2B] whitespace-nowrap transition-colors"
              >
                {lang === 'bn' ? 'সার্টিফিকেট যাচাই →' : 'Verify →'}
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'bn' ? 'আপনার প্রশ্ন লিখুন...' : 'Ask about courses or admission...'}
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F4F8F6] border border-slate-200 text-xs sm:text-sm text-[#0F241D] focus:outline-none focus:ring-2 focus:ring-[#006A4E] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="p-2.5 rounded-xl bg-[#006A4E] hover:bg-[#092A20] disabled:opacity-50 text-white transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close AI Assistant' : 'Open DYD AI Assistant'}
        className="ml-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#092A20] via-[#006A4E] to-[#0E805F] hover:from-[#006A4E] hover:to-[#092A20] text-white shadow-[0_14px_34px_rgba(0,106,78,0.34)] border border-emerald-400/25 transition-all hover:-translate-y-0.5 cursor-pointer"
      >
        <span className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-white/15">
          {open ? <X className="w-4 h-4" /> : <MessageSquare className="w-4 h-4 text-emerald-100" />}
          {!open && (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D92B2B]"
            />
          )}
        </span>
        <span className="text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap">
          <TextFadeSwitch textKey={`fab-${lang}-${open}`}>
            {open
              ? lang === 'bn'
                ? 'বন্ধ করুন'
                : 'Close Chat'
              : lang === 'bn'
              ? 'AI সহায়ক'
              : 'Ask DYD AI'}
          </TextFadeSwitch>
        </span>
      </button>
    </div>
  );
}
