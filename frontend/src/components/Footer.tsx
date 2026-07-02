import { Link } from "react-router-dom";
import { HeartPulse, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg text-brand-700">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-brand-500 to-care-500 text-white">
              <HeartPulse size={18} />
            </span>
            Sahayak
          </div>
          <p className="mt-3 text-sm text-ink-500 max-w-xs">{t("footer_tagline")}</p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm text-ink-900 mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-ink-500">
            <li><Link to="/chat" className="hover:text-brand-600">{t("nav_chat")}</Link></li>
            <li><Link to="/telemedicine" className="hover:text-brand-600">{t("nav_telemedicine")}</Link></li>
            <li><Link to="/health-tips" className="hover:text-brand-600">{t("nav_tips")}</Link></li>
            <li><Link to="/hospitals" className="hover:text-brand-600">{t("nav_hospitals")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm text-ink-900 mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-ink-500">
            <li><Link to="/about" className="hover:text-brand-600">{t("nav_about")}</Link></li>
            <li><Link to="/contact" className="hover:text-brand-600">{t("nav_contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm text-ink-900 mb-3">Emergency</h4>
          <a
            href="tel:108"
            className="inline-flex items-center gap-2 rounded-full bg-alert-500/10 px-4 py-2 text-sm font-semibold text-alert-600"
          >
            <Phone size={16} /> Dial 108
          </a>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} Sahayak. Educational guidance only — not a substitute for professional medical care.
      </div>
    </footer>
  );
}
