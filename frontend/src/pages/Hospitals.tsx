import { useEffect, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { api } from "../services/api";
import type { Doctor } from "../types";

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
      <h1 className="font-display text-2xl font-bold text-ink-900">Nearby Hospitals</h1>
      <p className="text-sm text-ink-500 mt-1">
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
        <p className="text-ink-500 text-sm mt-8">Loading…</p>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 gap-5">
          {groups.map((g) => (
            <div key={g.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <MapPin size={20} />
                </span>
                <h3 className="font-display font-semibold text-ink-900">{g.name}</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {g.doctors.map((d) => (
                  <li key={d.id} className="text-sm text-ink-700 flex items-center justify-between">
                    <span>{d.full_name} — {d.specialization}</span>
                    {d.phone && (
                      <a href={`tel:${d.phone}`} className="text-brand-600 font-medium">
                        {d.phone}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
