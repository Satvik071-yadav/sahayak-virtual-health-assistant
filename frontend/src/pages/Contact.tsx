import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "../components/ui/primitives";
import { Input } from "../components/ui/primitives";
import Button from "../components/ui/Button";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10">
      <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
        <SectionHeading eyebrow="We're listening" title="Get in touch" center={false} />
        <p className="mt-3 text-ink-700 dark:text-ink-300">
          Questions, feedback, or partnership ideas? We'd love to hear from you.
        </p>
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 text-sm text-ink-700 dark:text-ink-300">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300"><Mail size={18} /></span>
            support@sahayak-health.example
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-700 dark:text-ink-300">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300"><Phone size={18} /></span>
            +91-9000000000
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-700 dark:text-ink-300">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300"><MapPin size={18} /></span>
            Rural Health Innovation Hub, India
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl border border-slate-100 dark:border-white/8 bg-white dark:bg-ink-800 p-6 shadow-sm">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260 }}>
                <CheckCircle2 className="mx-auto text-success-500" size={44} />
              </motion.div>
              <p className="font-display font-semibold text-ink-900 dark:text-white mt-3">Thank you!</p>
              <p className="text-sm text-ink-500 mt-1">Your message has been noted. We'll get back to you soon.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Name</label>
                <Input required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Email</label>
                <Input type="email" required className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Message</label>
                <textarea required rows={4} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
              </div>
              <Button type="submit" className="w-full" icon={<Send size={16} />}>Send message</Button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
