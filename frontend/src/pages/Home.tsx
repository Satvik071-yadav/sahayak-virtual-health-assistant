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
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const quickActions = [
  { icon: MessageCircleHeart, labelKey: "quick_symptom", to: "/chat", color: "brand" },
  { icon: MapPinned, labelKey: "quick_hospital", to: "/hospitals", color: "care" },
  { icon: Stethoscope, labelKey: "quick_doctor", to: "/telemedicine", color: "brand" },
  { icon: Calculator, labelKey: "quick_bmi", to: "/health-tips", color: "care" },
  { icon: BellRing, labelKey: "quick_reminder", to: "/health-tips", color: "brand" },
  { icon: BookOpenText, labelKey: "quick_articles", to: "/health-tips", color: "care" },
] as const;

export default function Home() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50 via-white to-white" />
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-care-100 blur-3xl opacity-60" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block rounded-full bg-care-100 px-4 py-1.5 text-xs font-semibold text-care-600">
              {t("hero_eyebrow")}
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-ink-900 leading-tight">
              {t("hero_title")}
            </h1>
            <p className="mt-5 text-lg text-ink-700 max-w-xl">{t("hero_subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/chat"
                className="rounded-full bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-colors"
              >
                {t("hero_cta_chat")}
              </Link>
              <Link
                to="/emergency"
                className="rounded-full border-2 border-alert-500 px-6 py-3.5 text-sm font-semibold text-alert-600 hover:bg-alert-500/5 transition-colors"
              >
                {t("hero_cta_emergency")}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="glass rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-brand-500 to-care-500 text-white font-display font-bold">S</span>
                <div>
                  <p className="font-display font-semibold text-ink-900">Sahayak</p>
                  <p className="text-xs text-care-600 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-care-500 inline-block" /> Online
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm text-ink-700">
                  Namaste! How can I help with your health today?
                </div>
                <div className="max-w-[85%] ml-auto rounded-2xl rounded-tr-sm bg-brand-500 px-4 py-2.5 text-sm text-white">
                  My mother has had a mild fever for 2 days.
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-2.5 text-sm text-ink-700">
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
                className="flex flex-col items-center gap-2.5 rounded-2xl bg-white p-5 text-center shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl ${
                    action.color === "brand" ? "bg-brand-50 text-brand-600" : "bg-care-50 text-care-600"
                  }`}
                >
                  <action.icon size={22} />
                </span>
                <span className="text-xs font-semibold text-ink-700 leading-tight">
                  {t(action.labelKey)}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, titleKey: "trust_no_diagnosis", bodyKey: "trust_no_diagnosis_body" },
            { icon: Clock, titleKey: "trust_always_on", bodyKey: "trust_always_on_body" },
            { icon: Languages, titleKey: "trust_two_languages", bodyKey: "trust_two_languages_body" },
          ].map((card) => (
            <div key={card.titleKey} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <card.icon size={20} />
              </span>
              <h3 className="mt-4 font-display font-semibold text-ink-900">{t(card.titleKey as any)}</h3>
              <p className="mt-2 text-sm text-ink-500">{t(card.bodyKey as any)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
