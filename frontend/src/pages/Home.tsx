import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircleHeart,
  MapPinned,
  Stethoscope,
  Calculator,
  BellRing,
  BookOpenText,
  ShieldCheck,
  Clock,
  Languages,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Users,
  Activity,
  Star,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import { Card, SectionHeading, Badge } from "../components/ui/primitives";
import Button from "../components/ui/Button";

const quickActions = [
  { icon: MessageCircleHeart, labelKey: "quick_symptom", to: "/chat", color: "brand" },
  { icon: MapPinned, labelKey: "quick_hospital", to: "/hospitals", color: "care" },
  { icon: Stethoscope, labelKey: "quick_doctor", to: "/telemedicine", color: "brand" },
  { icon: Calculator, labelKey: "quick_bmi", to: "/health-tips", color: "care" },
  { icon: BellRing, labelKey: "quick_reminder", to: "/health-tips", color: "brand" },
  { icon: BookOpenText, labelKey: "quick_articles", to: "/health-tips", color: "care" },
] as const;

const stats = [
  { icon: Users, value: 10000, suffix: "+", label: "Patients helped" },
  { icon: Stethoscope, value: 500, suffix: "+", label: "Partner doctors" },
  { icon: Clock, value: 24, suffix: "/7", label: "AI availability" },
  { icon: Star, value: 98, suffix: "%", label: "Satisfaction rate" },
];

const timeline = [
  { title: "Tell Sahayak what's wrong", body: "Describe symptoms in plain English or Hindi — no medical terms needed." },
  { title: "Get grounded guidance", body: "Receive clear, safe next steps: home care, prevention tips, or a doctor referral." },
  { title: "Connect with real care", body: "Book a telemedicine slot or find your nearest hospital in one tap." },
];

const testimonials = [
  { name: "Radha Devi", role: "Farmer, Uttar Pradesh", quote: "Sahayak helped me understand my father's symptoms before we could reach the district hospital. It told us clearly when to hurry.", rating: 5 },
  { name: "Sunil Kumar", role: "Shop owner, Bihar", quote: "The Hindi chat feels like talking to a calm, patient friend who happens to know a lot about health.", rating: 5 },
  { name: "Meena Yadav", role: "ASHA worker, Madhya Pradesh", quote: "I now recommend Sahayak to families I visit. The medicine reminders alone have improved adherence a lot.", rating: 4 },
];

const faqs = [
  { q: "Can Sahayak diagnose my illness?", a: "No. Sahayak only gives general health education and guidance. It always recommends seeing a real doctor for diagnosis and treatment." },
  { q: "Is Sahayak free to use?", a: "Yes, the core chatbot, health articles, and calculators are completely free. Some telemedicine consultations may have a doctor's fee." },
  { q: "What if I don't have great internet?", a: "Sahayak is built to be lightweight and works well even on slower rural connections." },
  { q: "Which languages are supported?", a: "English and Hindi today, with a multilingual architecture ready for more Indian languages soon." },
];

export default function Home() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50 via-white to-white dark:from-brand-500/10 dark:via-ink-900 dark:to-ink-900" />
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-care-400/20 dark:bg-care-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 20, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 -left-32 -z-10 h-80 w-80 rounded-full bg-accent-400/20 dark:bg-accent-500/10 blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-care-100 dark:bg-care-500/10 px-4 py-1.5 text-xs font-semibold text-care-600 dark:text-care-400"
            >
              <Sparkles size={13} /> {t("hero_eyebrow")}
            </motion.span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-900 dark:text-white leading-[1.08]">
              {t("hero_title").split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5 }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <p className="mt-5 text-lg text-ink-700 dark:text-ink-400 max-w-xl">{t("hero_subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/chat">
                <Button size="lg" iconRight={<ArrowRight size={17} />}>
                  {t("hero_cta_chat")}
                </Button>
              </Link>
              <Link to="/emergency">
                <Button size="lg" variant="danger" className="!bg-transparent !shadow-none !border-2 !border-alert-500 !text-alert-600 hover:!bg-alert-500/5">
                  {t("hero_cta_emergency")}
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 flex-wrap">
              {stats.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold text-ink-900 dark:text-white">
                    <AnimatedCounter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-xs text-ink-500">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 z-10 hidden sm:flex items-center gap-2 rounded-2xl glass px-4 py-3 shadow-lg"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-care-500/15 text-care-600">
                <Activity size={16} />
              </span>
              <div>
                <p className="text-xs font-semibold text-ink-900 dark:text-white">Vitals steady</p>
                <p className="text-[10px] text-ink-500">Live monitoring tip</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-5 -right-4 z-10 hidden sm:flex items-center gap-2 rounded-2xl glass px-4 py-3 shadow-lg"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-500/15 text-brand-600">
                <ShieldCheck size={16} />
              </span>
              <div>
                <p className="text-xs font-semibold text-ink-900 dark:text-white">Never diagnoses</p>
                <p className="text-[10px] text-ink-500">Always safe guidance</p>
              </div>
            </motion.div>

            <div className="glass rounded-3xl p-6 shadow-2xl shadow-brand-500/10">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-brand-500 to-care-500 text-white font-display font-bold">S</span>
                <div>
                  <p className="font-display font-semibold text-ink-900 dark:text-white">Sahayak</p>
                  <p className="text-xs text-care-600 dark:text-care-400 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-care-500 inline-block animate-pulse" /> Online
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-white/5 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-200">
                  Namaste! How can I help with your health today?
                </div>
                <div className="max-w-[85%] ml-auto rounded-2xl rounded-tr-sm bg-linear-to-r from-brand-600 to-accent-600 px-4 py-2.5 text-sm text-white">
                  My mother has had a mild fever for 2 days.
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 dark:bg-white/5 px-4 py-2.5 text-sm text-ink-700 dark:text-ink-200">
                  Let's understand this better — rest, fluids, and monitoring help.
                  If fever crosses 3 days or worsens, please visit a doctor.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.labelKey}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                to={action.to}
                className="flex flex-col items-center gap-2.5 rounded-2xl bg-white dark:bg-ink-800 p-5 text-center shadow-sm border border-slate-100 dark:border-white/8 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl ${
                    action.color === "brand" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300" : "bg-care-50 dark:bg-care-500/10 text-care-600 dark:text-care-400"
                  }`}
                >
                  <action.icon size={22} />
                </span>
                <span className="text-xs font-semibold text-ink-700 dark:text-ink-100 leading-tight">
                  {t(action.labelKey)}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-linear-to-r from-ink-900 to-brand-900 dark:from-black dark:to-ink-900 p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white mb-3">
                <s.icon size={20} />
              </span>
              <p className="font-display text-3xl font-bold text-white">
                <AnimatedCounter to={s.value} suffix={s.suffix} />
              </p>
              <p className="text-xs text-white/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <SectionHeading
          eyebrow="Why families trust us"
          title="Careful by design, not by accident"
          subtitle="Every part of Sahayak is built around one rule: guide, never diagnose."
        />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, titleKey: "trust_no_diagnosis", bodyKey: "trust_no_diagnosis_body" },
            { icon: Clock, titleKey: "trust_always_on", bodyKey: "trust_always_on_body" },
            { icon: Languages, titleKey: "trust_two_languages", bodyKey: "trust_two_languages_body" },
          ].map((card, i) => (
            <motion.div
              key={card.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="p-6" hover>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300">
                  <card.icon size={20} />
                </span>
                <h3 className="mt-4 font-display font-semibold text-ink-900 dark:text-white">{t(card.titleKey as any)}</h3>
                <p className="mt-2 text-sm text-ink-500">{t(card.bodyKey as any)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline / how it works */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading eyebrow="How it works" title="From worry to clarity in three steps" />
        <div className="mt-14 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-brand-200 via-care-200 to-transparent dark:from-brand-500/20 dark:via-care-500/20" />
          <div className="space-y-10">
            {timeline.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-10" : "md:pl-10 md:ml-auto"}`}
              >
                <Card className="p-6" hover={false}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-brand-500 to-accent-500 text-white font-display font-bold text-sm">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 font-display font-semibold text-ink-900 dark:text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-500">{step.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <SectionHeading eyebrow="Real stories" title="Trusted across rural India" />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {testimonials.map((tm, i) => (
            <motion.div
              key={tm.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col" hover>
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={14} className={idx < tm.rating ? "fill-amber-400" : "fill-none text-slate-300"} />
                  ))}
                </div>
                <p className="mt-3 text-sm text-ink-700 dark:text-ink-300 flex-1">"{tm.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 font-display font-bold text-sm">
                    {tm.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-white">{tm.name}</p>
                    <p className="text-xs text-ink-500">{tm.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-ink-800 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-medium text-sm text-ink-900 dark:text-white">{f.q}</span>
                <ChevronDown
                  className={`transition-transform text-ink-500 shrink-0 ml-3 ${openFaq === i ? "rotate-180" : ""}`}
                  size={18}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-ink-500">{f.a}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 via-brand-500 to-accent-500 p-12 text-center"
        >
          <Badge tone="neutral" className="!bg-white/15 !text-white">Free forever for patients</Badge>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white">
            Your health questions deserve a safe answer
          </h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Start a conversation with Sahayak right now — no downloads, no waiting rooms.
          </p>
          <Link to="/chat" className="inline-block mt-7">
            <Button variant="glass" size="lg" className="!bg-white !text-brand-700 hover:!bg-white/90" iconRight={<ArrowRight size={17} />}>
              {t("hero_cta_chat")}
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
