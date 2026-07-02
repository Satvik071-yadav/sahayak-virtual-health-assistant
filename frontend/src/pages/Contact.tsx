import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink-900">Get in touch</h1>
        <p className="mt-3 text-ink-700">
          Questions, feedback, or partnership ideas? We'd love to hear from you.
        </p>
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 text-sm text-ink-700">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><Mail size={18} /></span>
            support@sahayak-health.example
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-700">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><Phone size={18} /></span>
            +91-9000000000
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-700">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600"><MapPin size={18} /></span>
            Rural Health Innovation Hub, India
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        {sent ? (
          <div className="text-center py-10">
            <p className="font-display font-semibold text-ink-900">Thank you!</p>
            <p className="text-sm text-ink-500 mt-1">Your message has been noted. We'll get back to you soon.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-ink-700">Name</label>
              <input required className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Email</label>
              <input type="email" required className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700">Message</label>
              <textarea required rows={4} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm" />
            </div>
            <button className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600">
              <Send size={16} /> Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
