import { useEffect, useState } from "react";
import { Star, Stethoscope, CalendarPlus, CheckCircle2 } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Doctor } from "../types";
import { Link } from "react-router-dom";

export default function Telemedicine() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState("");
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

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl font-bold text-ink-900">Telemedicine</h1>
      <p className="text-sm text-ink-500 mt-1">Book a video or phone consultation with a verified doctor.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSpecialization("")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold border ${
            specialization === "" ? "bg-brand-500 text-white border-brand-500" : "border-slate-200 text-ink-700"
          }`}
        >
          All
        </button>
        {specializations.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialization(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold border ${
              specialization === s ? "bg-brand-500 text-white border-brand-500" : "border-slate-200 text-ink-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink-500 text-sm mt-8">Loading doctors…</p>
      ) : (
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Stethoscope size={22} />
                </span>
                <div>
                  <p className="font-display font-semibold text-ink-900">{doc.full_name}</p>
                  <p className="text-xs text-brand-600 font-medium">{doc.specialization}</p>
                </div>
              </div>
              <p className="text-sm text-ink-500 mt-3">{doc.bio}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
                <span className="flex items-center gap-1"><Star size={14} className="text-amber-400 fill-amber-400" /> {doc.rating.toFixed(1)}</span>
                <span>{doc.years_experience} yrs experience</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold text-ink-900">₹{doc.consultation_fee}</span>
                <button
                  onClick={() => {
                    if (!user) return;
                    setBookingFor(doc);
                    setStatus("idle");
                  }}
                  className="flex items-center gap-1.5 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600"
                >
                  <CalendarPlus size={14} /> Book
                </button>
              </div>
              {!user && (
                <p className="mt-2 text-xs text-ink-400">
                  <Link to="/login" className="underline">Log in</Link> to book an appointment.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {bookingFor && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setBookingFor(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            {status === "done" ? (
              <div className="text-center py-6">
                <CheckCircle2 className="mx-auto text-care-500" size={44} />
                <p className="mt-3 font-display font-semibold text-ink-900">Appointment requested</p>
                <p className="text-sm text-ink-500 mt-1">We'll confirm your slot with {bookingFor.full_name} soon.</p>
                <button
                  onClick={() => setBookingFor(null)}
                  className="mt-5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display font-bold text-lg text-ink-900">Book with {bookingFor.full_name}</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-ink-700">Preferred date & time</label>
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink-700">Reason for visit (optional)</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  {status === "error" && <p className="text-sm text-alert-600">Something went wrong. Please try again.</p>}
                  <button
                    onClick={bookAppointment}
                    disabled={!date || status === "booking"}
                    className="w-full rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
                  >
                    {status === "booking" ? "Booking…" : "Confirm booking"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
