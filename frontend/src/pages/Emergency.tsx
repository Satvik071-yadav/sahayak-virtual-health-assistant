import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, AlertTriangle, HeartPulse, Wind, Bone } from "lucide-react";
import { api } from "../services/api";
import type { EmergencyContact } from "../types";
import { Card } from "../components/ui/primitives";

const instructions = [
  { icon: HeartPulse, title: "Chest pain or heart attack signs", body: "Sit the person down, loosen tight clothing, and call for help immediately. Do not let them walk around." },
  { icon: Wind, title: "Difficulty breathing", body: "Keep them upright and calm. Avoid crowding them. Get to fresh air if possible, and call for help." },
  { icon: Bone, title: "Severe injury or bleeding", body: "Apply firm, steady pressure with a clean cloth. Do not remove embedded objects. Keep the person still." },
];

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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-alert-600 to-red-800 p-8 mb-10 text-white"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative flex items-start gap-4">
          <AlertTriangle className="mt-1 shrink-0" size={30} />
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Medical Emergency?</h1>
            <p className="mt-2 text-white/85 max-w-xl">
              If someone's life is at risk — severe bleeding, unconsciousness, chest pain,
              difficulty breathing — call for help immediately. Don't wait for a chatbot response.
            </p>
            <motion.a
              href="tel:108"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-alert-700 shadow-lg"
            >
              <span className="absolute inset-0 rounded-full animate-pulse-ring" />
              <Phone size={18} /> Call 108 (Ambulance)
            </motion.a>
          </div>
        </div>
      </motion.div>

      <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white mb-4">What to do while help arrives</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {instructions.map((ins, i) => (
          <motion.div key={ins.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <Card className="p-5 h-full border-alert-500/10" hover>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-alert-50 dark:bg-alert-500/10 text-alert-600">
                <ins.icon size={18} />
              </span>
              <h3 className="mt-3 font-display font-semibold text-sm text-ink-900 dark:text-white">{ins.title}</h3>
              <p className="mt-1.5 text-xs text-ink-500">{ins.body}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-white mb-4">All emergency numbers</h2>
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {contacts.map((c, i) => (
            <motion.a
              key={c.id}
              href={`tel:${c.phone_number}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-slate-100 dark:border-white/8 bg-white dark:bg-ink-800 p-5 shadow-sm hover:shadow-lg transition-shadow flex items-center gap-4"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-alert-50 dark:bg-alert-500/10 text-alert-600 shrink-0">
                <Phone size={20} />
              </span>
              <div>
                <p className="font-semibold text-ink-900 dark:text-white text-sm">{c.label}</p>
                <p className="text-alert-600 font-bold">{c.phone_number}</p>
                {c.description && <p className="text-xs text-ink-500 mt-0.5">{c.description}</p>}
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
