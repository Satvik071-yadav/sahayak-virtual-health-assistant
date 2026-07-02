import { useEffect, useState } from "react";
import { Phone, AlertTriangle } from "lucide-react";
import { api } from "../services/api";
import type { EmergencyContact } from "../types";

export default function Emergency() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<EmergencyContact[]>("/api/emergency-contacts")
      .then((res) => setContacts(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl bg-alert-500/5 border border-alert-500/20 p-6 flex items-start gap-4 mb-8">
        <AlertTriangle className="text-alert-600 mt-1 shrink-0" size={28} />
        <div>
          <h1 className="font-display text-2xl font-bold text-alert-600">Medical Emergency?</h1>
          <p className="text-ink-700 mt-1">
            If someone's life is at risk — severe bleeding, unconsciousness, chest pain,
            difficulty breathing — call for help immediately. Don't wait for a chatbot response.
          </p>
          <a
            href="tel:108"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-alert-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-alert-600"
          >
            <Phone size={18} /> Call 108 (Ambulance)
          </a>
        </div>
      </div>

      <h2 className="font-display text-lg font-semibold text-ink-900 mb-4">All emergency numbers</h2>
      {loading ? (
        <p className="text-ink-500 text-sm">Loading…</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {contacts.map((c) => (
            <a
              key={c.id}
              href={`tel:${c.phone_number}`}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 shrink-0">
                <Phone size={20} />
              </span>
              <div>
                <p className="font-semibold text-ink-900 text-sm">{c.label}</p>
                <p className="text-brand-600 font-bold">{c.phone_number}</p>
                {c.description && <p className="text-xs text-ink-500 mt-0.5">{c.description}</p>}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
