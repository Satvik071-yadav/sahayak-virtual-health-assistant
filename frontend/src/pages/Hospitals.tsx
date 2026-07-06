import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, Phone } from "lucide-react";
import { api } from "../services/api";
import type { Doctor } from "../types";
import { Card, SectionHeading } from "../components/ui/primitives";

interface HospitalGroup {
  name: string;
  doctors: Doctor[];
}

export default function Hospitals() {
  const [groups, setGroups] = useState<HospitalGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Doctor[]>("/api/doctors/").then((res) => {
      const map = new Map<string, Doctor[]>();
      res.data.forEach((d) => {
        const key = d.hospital_name || "Independent Practice";
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(d);
      });
      setGroups(Array.from(map.entries()).map(([name, doctors]) => ({ name, doctors })));
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeading eyebrow="Find care nearby" title="Nearby Hospitals" center={false} />
      <p className="text-sm text-ink-500 mt-3 max-w-xl">
        Hospitals and clinics connected to our partner doctors. For your closest facility, you can also
        search Google Maps directly.
      </p>
      <a
        href="https://www.google.com/maps/search/hospital+near+me"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline"
      >
        Open Google Maps <ExternalLink size={14} />
      </a>

      {loading ? (
        <div className="mt-8 grid sm:grid-cols-2 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 gap-5">
          {groups.map((g, i) => (
            <motion.div key={g.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Card className="p-6" hover>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300">
                    <MapPin size={20} />
                  </span>
                  <h3 className="font-display font-semibold text-ink-900 dark:text-white">{g.name}</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {g.doctors.map((d) => (
                    <li key={d.id} className="text-sm text-ink-700 dark:text-ink-200 flex items-center justify-between">
                      <span>{d.full_name} — {d.specialization}</span>
                      {d.phone && (
                        <a href={`tel:${d.phone}`} className="text-brand-600 dark:text-brand-300 font-medium flex items-center gap-1">
                          <Phone size={12} /> {d.phone}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
