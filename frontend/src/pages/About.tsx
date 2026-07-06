import { motion } from "framer-motion";
import { ShieldCheck, Users, Globe2, HeartHandshake } from "lucide-react";
import { SectionHeading, Card } from "../components/ui/primitives";

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeading eyebrow="Our mission" title="About Sahayak" center={false} />
      </motion.div>
      <p className="mt-6 text-ink-700 dark:text-ink-300 leading-relaxed">
        Sahayak is a virtual health assistant built for people in rural areas who often
        lack easy access to doctors, clear health information, or digital tools designed
        for their needs. We combine a friendly AI chatbot with real telemedicine
        connections so that good health guidance is never more than a message away.
      </p>
      <p className="mt-4 text-ink-700 dark:text-ink-300 leading-relaxed">
        Sahayak does not diagnose diseases or prescribe medicine. Instead, it offers
        educational information, basic first-aid guidance, and preventive health tips —
        and always points people toward a qualified doctor when something needs real
        medical attention.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-5">
        {[
          { icon: ShieldCheck, title: "Safety first", body: "Every conversation is designed to escalate serious symptoms to real emergency care." },
          { icon: Users, title: "Built for everyone", body: "Simple language and a clean interface, designed for people with limited digital literacy." },
          { icon: Globe2, title: "Speaks your language", body: "Available in English and Hindi today, with more languages planned." },
          { icon: HeartHandshake, title: "Connected to real care", body: "Book telemedicine appointments with verified doctors directly from the app." },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <Card className="p-6 h-full" hover>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300">
                <item.icon size={20} />
              </span>
              <h3 className="mt-4 font-display font-semibold text-ink-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-ink-500">{item.body}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
