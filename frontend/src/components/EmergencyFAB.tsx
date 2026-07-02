import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function EmergencyFAB() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-64 rounded-2xl border border-alert-500/20 bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-alert-600">{t("emergency_banner")}</p>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink-500">
              <X size={16} />
            </button>
          </div>
          <a
            href="tel:108"
            className="mt-3 flex items-center justify-center gap-2 rounded-full bg-alert-500 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-alert-600"
          >
            <Phone size={16} /> Call 108 now
          </a>
          <Link
            to="/emergency"
            onClick={() => setOpen(false)}
            className="mt-2 block text-center text-xs font-medium text-ink-500 hover:text-brand-600 underline"
          >
            More emergency numbers
          </Link>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="grid h-14 w-14 place-items-center rounded-full bg-alert-500 text-white shadow-lg shadow-alert-500/40 hover:bg-alert-600 animate-pulse"
        aria-label="Emergency help"
      >
        <Phone size={24} />
      </button>
    </div>
  );
}
