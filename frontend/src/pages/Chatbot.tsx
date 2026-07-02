import { useEffect, useRef, useState } from "react";
import { Send, AlertTriangle, Loader2 } from "lucide-react";
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

export default function Chatbot() {
  const { user, loading: authLoading } = useAuth();
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [escalate, setEscalate] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" state={{ from: "/chat" }} replace />;

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput("");
    setSending(true);
    setEscalate(false);

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
    } catch (err) {
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

  const suggestions = lang === "hi" ? SUGGESTIONS_HI : SUGGESTIONS_EN;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold text-ink-900">{t("nav_chat")}</h1>
        <p className="text-sm text-ink-500 mt-1">
          Educational guidance only — Sahayak never diagnoses. In an emergency, call 108.
        </p>
      </div>

      {escalate && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-alert-500/30 bg-alert-500/5 p-4">
          <AlertTriangle className="mt-0.5 text-alert-600 shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-semibold text-alert-600">This may be a medical emergency.</p>
            <p className="text-ink-700 mt-1">
              Please call emergency services now.{" "}
              <a href="tel:108" className="font-semibold underline">Dial 108</a> or{" "}
              <Link to="/emergency" className="font-semibold underline">see emergency contacts</Link>.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col h-[65vh]">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {historyLoaded && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <p className="text-ink-500 text-sm max-w-sm">
                Ask about symptoms, first aid, vaccinations, nutrition, or anything health-related.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-ink-700 hover:border-brand-300 hover:bg-brand-50 text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.sender === "user"
                  ? "ml-auto rounded-tr-sm bg-brand-500 text-white"
                  : "rounded-tl-sm bg-slate-100 text-ink-800"
              }`}
            >
              {m.content}
            </div>
          ))}

          {sending && (
            <div className="max-w-[60%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm text-ink-500 flex items-center gap-2">
              <Loader2 className="animate-spin" size={14} /> Sahayak is typing…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="border-t border-slate-100 p-3 flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "hi" ? "अपना सवाल यहां लिखें…" : "Type your question here…"}
            className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="grid h-11 w-11 place-items-center rounded-full bg-brand-500 text-white disabled:opacity-40 hover:bg-brand-600 shrink-0"
            aria-label="Send"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
