import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartPulse, Phone, Mail, MapPin, Send } from "lucide-react";
import { FaGithub, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useLanguage } from "../context/LanguageContext";
import Button from "./ui/Button";

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! We'll keep you posted on new health tips.");
    setEmail("");
  }

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-ink-900">
      <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-brand-500/5 blur-3xl" />
      <div className="absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-care-500/5 blur-3xl" />

      {/* Newsletter */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-linear-to-r from-brand-600 via-brand-500 to-accent-500 p-8 sm:p-10 shadow-2xl shadow-brand-500/20 grid md:grid-cols-2 gap-6 items-center"
        >
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">Stay a step ahead of illness</h3>
            <p className="mt-1.5 text-sm text-white/80">
              One friendly health tip a week. No spam, unsubscribe anytime.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-full border-0 bg-white/95 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button type="submit" variant="glass" className="!bg-ink-900 !text-white shrink-0" icon={<Send size={15} />}>
              Join
            </Button>
          </form>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg text-ink-900 dark:text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-care-500 text-white">
              <HeartPulse size={18} />
            </span>
            Sahayak
          </div>
          <p className="mt-3 text-sm text-ink-500 max-w-xs">{t("footer_tagline")}</p>
          <div className="mt-4 flex gap-2">
            {[FaGithub, FaXTwitter, FaLinkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 dark:border-white/10 text-ink-500 hover:text-brand-600 hover:border-brand-300 transition-colors"
                aria-label="Social link"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm text-ink-900 dark:text-white mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-ink-500">
            <li><Link to="/chat" className="hover:text-brand-600 transition-colors">{t("nav_chat")}</Link></li>
            <li><Link to="/telemedicine" className="hover:text-brand-600 transition-colors">{t("nav_telemedicine")}</Link></li>
            <li><Link to="/health-tips" className="hover:text-brand-600 transition-colors">{t("nav_tips")}</Link></li>
            <li><Link to="/hospitals" className="hover:text-brand-600 transition-colors">{t("nav_hospitals")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm text-ink-900 dark:text-white mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-ink-500">
            <li><Link to="/about" className="hover:text-brand-600 transition-colors">{t("nav_about")}</Link></li>
            <li><Link to="/contact" className="hover:text-brand-600 transition-colors">{t("nav_contact")}</Link></li>
          </ul>
          <ul className="mt-2 space-y-2 text-sm text-ink-500">
            <li className="flex items-center gap-2"><Mail size={14} /> support@sahayak-health.example</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Rural Health Innovation Hub, India</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm text-ink-900 dark:text-white mb-3">Emergency</h4>
          <a
            href="tel:108"
            className="inline-flex items-center gap-2 rounded-full bg-alert-500/10 px-4 py-2 text-sm font-semibold text-alert-600 hover:bg-alert-500/15 transition-colors"
          >
            <Phone size={16} /> Dial 108
          </a>
        </div>
      </div>
      <div className="relative border-t border-slate-100 dark:border-white/10 py-5 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} Sahayak. Educational guidance only — not a substitute for professional medical care.
      </div>
    </footer>
  );
}
