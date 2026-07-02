import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    preferred_language: "en",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-ink-900">Create your account</h1>
        <p className="text-sm text-ink-500 mt-1">It only takes a minute.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-700">Full name</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Phone (optional)</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Preferred language</label>
            <select
              value={form.preferred_language}
              onChange={(e) => setForm({ ...form, preferred_language: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
          {error && <p className="text-sm text-alert-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
