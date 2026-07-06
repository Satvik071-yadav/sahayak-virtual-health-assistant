import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Stethoscope, CalendarPlus, CheckCircle2, Search, MapPin } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Doctor } from "../types";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/primitives";
import Button from "../components/ui/Button";

export default function Telemedicine() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState("");
  const [query, setQuery] = useState("");
  const [bookingFor, setBookingFor] = useState<Doctor | null>(null);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"idle" | "booking" | "done" | "error">("idle");

  useEffect(() => {
    setLoading(true);
    api
      .get<Doctor[]>("/api/doctors/", { params: specialization ? { specialization } : {} })
      .then((res) => setDoctors(res.data))
      .finally(() => setLoading(false));
  }, [specialization]);

  async function bookAppointment() {
    if (!bookingFor || !date) return;
    setStatus("booking");
    try {
      await api.post("/api/doctors/appointments", {
        doctor_id: bookingFor.id,
        scheduled_at: new Date(date).toISOString(),
        reason,
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const specializations = Array.from(new Set(doctors.map((d) => d.specialization)));
  const filtered = useMemo(
    () => doctors.filter((d) => d.full_name.toLowerCase().includes(query.toLowerCase()) || d.specialization.toLowerCase().includes(query.toLowerCase())),
    [doctors, query]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Telemedicine</h1>
        <p className="text-sm text-ink-500 mt-1">Book a video or phone consultation with a verified doctor.</p>
      </motion.div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors or specialization…"
            className="w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSpecialization("")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors ${
            specialization === "" ? "bg-linear-to-r from-brand-600 to-accent-600 text-white border-transparent" : "border-slate-200 dark:border-white/10 text-ink-700 dark:text-ink-200"
          }`}
        >
          All
        </button>
        {specializations.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialization(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors ${
              specialization === s ? "bg-linear-to-r from-brand-600 to-accent-600 text-white border-transparent" : "border-slate-200 dark:border-white/10 text-ink-700 dark:text-ink-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doc, i) => (
            <motion.div key={doc.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Card className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-linear-to-br from-brand-500 to-care-500 text-white font-display font-bold">
                    {doc.full_name.split(" ").slice(-1)[0].charAt(0)}
                  </span>
                  <div>
                    <p className="font-display font-semibold text-ink-900 dark:text-white">{doc.full_name}</p>
                    <p className="text-xs text-brand-600 dark:text-brand-300 font-medium">{doc.specialization}</p>
                  </div>
                </div>
                {doc.hospital_name && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
                    <MapPin size={13} /> {doc.hospital_name}
                  </p>
                )}
                <p className="mt-2 text-sm text-ink-500 flex-1">{doc.bio}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
                  <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {doc.rating.toFixed(1)}</span>
                  <span>{doc.years_experience} yrs experience</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-semibold text-ink-900 dark:text-white">₹{doc.consultation_fee}</span>
                  <Button
                    size="sm"
                    icon={<CalendarPlus size={14} />}
                    onClick={() => {
                      if (!user) return;
                      setBookingFor(doc);
                      setStatus("idle");
                    }}
                  >
                    Book
                  </Button>
                </div>
                {!user && (
                  <p className="mt-2 text-xs text-ink-400">
                    <Link to="/login" className="underline">Log in</Link> to book an appointment.
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-ink-500 py-12">No doctors match your search.</p>
          )}
        </div>
      )}

      <AnimatePresence>
        {bookingFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setBookingFor(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-ink-800 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {status === "done" ? (
                <div className="text-center py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260 }}>
                    <CheckCircle2 className="mx-auto text-success-500" size={44} />
                  </motion.div>
                  <p className="mt-3 font-display font-semibold text-ink-900 dark:text-white">Appointment requested</p>
                  <p className="text-sm text-ink-500 mt-1">We'll confirm your slot with {bookingFor.full_name} soon.</p>
                  <Button onClick={() => setBookingFor(null)} className="mt-5">Done</Button>
                </div>
              ) : (
                <>
                  <h3 className="font-display font-bold text-lg text-ink-900 dark:text-white flex items-center gap-2">
                    <Stethoscope size={18} className="text-brand-600" /> Book with {bookingFor.full_name}
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Preferred date & time</label>
                      <input
                        type="datetime-local"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Reason for visit (optional)</label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={3}
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                    {status === "error" && <p className="text-sm text-alert-600">Something went wrong. Please try again.</p>}
                    <Button onClick={bookAppointment} disabled={!date || status === "booking"} loading={status === "booking"} className="w-full">
                      Confirm booking
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
