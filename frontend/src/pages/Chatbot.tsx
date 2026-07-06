import { useEffect, useRef, useState } from "react";
import {
  Send,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Trash2,
  Mic,
  Volume2,
  VolumeX,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import type { ChatMessage } from "../types";
import { Link, Navigate } from "react-router-dom";

const SUGGESTIONS_EN = [
  "I have a mild headache",
  "How can I prevent dengue?",
  "My child missed a vaccination",
  "Tips for a healthy pregnancy",
];

const SUGGESTIONS_HI = [
  "मुझे हल्का सिरदर्द है",
  "डेंगू से कैसे बचें?",
  "मेरे बच्चे का टीका छूट गया",
  "स्वस्थ गर्भावस्था के लिए सुझाव",
];

// Progressively reveals bot text for a ChatGPT-like feel.
// The backend returns one complete reply per request (no server streaming),
// so this simulates a typing reveal purely on the client.
function useTypedReveal(fullText: string | null, onDone?: () => void) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    if (fullText === null) {
      setDisplay("");
      return;
    }
    let i = 0;
    setDisplay("");
    const step = Math.max(1, Math.floor(fullText.length / 120));
    const interval = setInterval(() => {
      i += step;
      setDisplay(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setDisplay(fullText);
        onDone?.();
      }
    }, 12);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullText]);
  return display;
}

export default function Chatbot() {
  const { user, loading: authLoading } = useAuth();
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [escalate, setEscalate] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, "up" | "down">>({});
  const [revealingId, setRevealingId] = useState<number | null>(null);
  const [voiceOn, setVoiceOn] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastUserMessage = useRef<string>("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;
    api
      .get<ChatMessage[]>("/api/chat/history")
      .then((res) => setMessages(res.data))
      .finally(() => setHistoryLoaded(true));
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const pendingBot = messages.find((m) => m.id === revealingId);
  const typedText = useTypedReveal(revealingId ? pendingBot?.content ?? "" : null, () => {
    if (voiceOn && pendingBot) speak(pendingBot.content);
    setRevealingId(null);
  });

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" state={{ from: "/chat" }} replace />;

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(utter);
  }

  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input isn't supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognitionRef.current = recognition;
    recognition.start();
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput("");
    setSending(true);
    setEscalate(false);
    lastUserMessage.current = trimmed;

    const optimisticUser: ChatMessage = {
      id: Date.now(),
      sender: "user",
      content: trimmed,
      language: lang,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);

    try {
      const { data } = await api.post("/api/chat/", { message: trimmed, language: lang });
      setMessages(data.history);
      setEscalate(data.escalate_to_emergency);
      const lastBot = [...data.history].reverse().find((m: ChatMessage) => m.sender === "bot");
      if (lastBot) setRevealingId(lastBot.id);
    } catch (err) {
      toast.error("Sahayak couldn't respond. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          content:
            lang === "hi"
              ? "क्षमा करें, अभी उत्तर नहीं दे पा रहे। कृपया बाद में पुनः प्रयास करें।"
              : "Sorry, I couldn't respond right now. Please try again shortly.",
          language: lang,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function regenerate() {
    if (!lastUserMessage.current || sending) return;
    sendMessage(lastUserMessage.current);
  }

  function clearView() {
    setMessages([]);
    toast("Chat view cleared. Your history is still saved on the server.", { icon: "🧹" });
  }

  function copyMessage(id: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const suggestions = lang === "hi" ? SUGGESTIONS_HI : SUGGESTIONS_EN;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#f7f9fc] dark:bg-[#05070d]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-slate-200 dark:border-white/8 bg-white dark:bg-ink-900 p-4">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-care-500 text-white">
            <Sparkles size={16} />
          </span>
          <div>
            <p className="font-display font-semibold text-sm text-ink-900 dark:text-white">Sahayak Chat</p>
            <p className="text-[11px] text-care-600 dark:text-care-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-care-500 animate-pulse" /> AI online
            </p>
          </div>
        </div>

        <button
          onClick={clearView}
          className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 px-3 py-2.5 text-sm text-ink-700 dark:text-ink-200 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <Trash2 size={15} /> Clear view
        </button>

        <p className="mt-6 mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Try asking</p>
        <div className="space-y-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-ink-700 dark:text-ink-200 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-700 dark:hover:text-brand-300 transition-colors line-clamp-1"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-auto rounded-2xl bg-linear-to-br from-brand-50 to-care-50 dark:from-brand-500/10 dark:to-care-500/10 p-4">
          <ShieldCheck className="text-brand-600 dark:text-brand-300" size={18} />
          <p className="mt-2 text-xs text-ink-700 dark:text-ink-200 leading-relaxed">
            Sahayak gives educational guidance only and never diagnoses. In an emergency, call{" "}
            <a href="tel:108" className="font-semibold underline">108</a>.
          </p>
        </div>
      </aside>

      {/* Main chat column */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-slate-200 dark:border-white/8 bg-white/70 dark:bg-ink-900/70 backdrop-blur px-5 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display text-base font-bold text-ink-900 dark:text-white">{t("nav_chat")}</h1>
            <p className="text-xs text-ink-500">Educational guidance only</p>
          </div>
          <button
            onClick={() => setVoiceOn((v) => !v)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              voiceOn
                ? "border-brand-300 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                : "border-slate-200 dark:border-white/10 text-ink-500"
            }`}
          >
            {voiceOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            Voice reply
          </button>
        </div>

        <AnimatePresence>
          {escalate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-5 mt-4 flex items-start gap-3 rounded-2xl border border-alert-500/30 bg-alert-500/5 p-4 overflow-hidden"
            >
              <AlertTriangle className="mt-0.5 text-alert-600 shrink-0" size={20} />
              <div className="text-sm">
                <p className="font-semibold text-alert-600">This may be a medical emergency.</p>
                <p className="text-ink-700 dark:text-ink-200 mt-1">
                  Please call emergency services now.{" "}
                  <a href="tel:108" className="font-semibold underline">Dial 108</a> or{" "}
                  <Link to="/emergency" className="font-semibold underline">see emergency contacts</Link>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {historyLoaded && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-5">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-brand-500 to-care-500 text-white shadow-lg shadow-brand-500/30">
                <Sparkles size={26} />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-ink-900 dark:text-white">How can I help today?</p>
                <p className="text-ink-500 text-sm max-w-sm mt-1">
                  Ask about symptoms, first aid, vaccinations, nutrition, or anything health-related.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {suggestions.map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ y: -2 }}
                    onClick={() => sendMessage(s)}
                    className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-2.5 text-sm text-ink-700 dark:text-ink-200 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-left transition-colors"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const isRevealing = m.id === revealingId;
            const content = isRevealing ? typedText : m.content;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group flex gap-3 max-w-3xl ${m.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    m.sender === "user"
                      ? "bg-ink-900 dark:bg-white/10 text-white"
                      : "bg-linear-to-br from-brand-500 to-care-500 text-white"
                  }`}
                >
                  {m.sender === "user" ? user.full_name.charAt(0).toUpperCase() : "S"}
                </span>
                <div className={`min-w-0 ${m.sender === "user" ? "items-end" : ""} flex flex-col`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed prose prose-sm max-w-none ${
                      m.sender === "user"
                        ? "rounded-tr-sm bg-linear-to-r from-brand-600 to-accent-600 text-white prose-invert"
                        : "rounded-tl-sm bg-white dark:bg-ink-800 border border-slate-100 dark:border-white/8 text-ink-800 dark:text-ink-100"
                    }`}
                  >
                    {m.sender === "bot" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                    ) : (
                      <p className="m-0 text-white">{content}</p>
                    )}
                  </div>
                  {m.sender === "bot" && !isRevealing && (
                    <div className="mt-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyMessage(m.id, m.content)}
                        className="rounded-lg p-1.5 text-ink-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-white/5"
                        aria-label="Copy message"
                      >
                        {copiedId === m.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={() => setFeedback((f) => ({ ...f, [m.id]: "up" }))}
                        className={`rounded-lg p-1.5 hover:bg-brand-50 dark:hover:bg-white/5 ${
                          feedback[m.id] === "up" ? "text-care-600" : "text-ink-400 hover:text-care-600"
                        }`}
                        aria-label="Good response"
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        onClick={() => setFeedback((f) => ({ ...f, [m.id]: "down" }))}
                        className={`rounded-lg p-1.5 hover:bg-brand-50 dark:hover:bg-white/5 ${
                          feedback[m.id] === "down" ? "text-alert-600" : "text-ink-400 hover:text-alert-600"
                        }`}
                        aria-label="Poor response"
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {sending && (
            <div className="flex gap-3 max-w-3xl">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-500 to-care-500 text-white text-xs font-bold">S</span>
              <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-ink-800 border border-slate-100 dark:border-white/8 px-4 py-3 flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="h-1.5 w-1.5 rounded-full bg-ink-400"
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-200 dark:border-white/8 bg-white dark:bg-ink-900 p-4">
          {lastUserMessage.current && !sending && (
            <button
              onClick={regenerate}
              className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-brand-600"
            >
              <RotateCcw size={13} /> Regenerate response
            </button>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={startListening}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors ${
                listening
                  ? "border-alert-400 bg-alert-500/10 text-alert-600 animate-pulse"
                  : "border-slate-200 dark:border-white/10 text-ink-500 hover:bg-slate-50 dark:hover:bg-white/5"
              }`}
              aria-label="Voice input"
            >
              <Mic size={17} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "hi" ? "अपना सवाल यहां लिखें…" : "Type your question here…"}
              className="flex-1 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={sending || !input.trim()}
              className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-r from-brand-600 to-accent-600 text-white disabled:opacity-40 shrink-0 shadow-lg shadow-brand-500/25"
              aria-label="Send"
            >
              <Send size={18} />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
