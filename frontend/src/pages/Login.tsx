import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(location.state?.from || "/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-ink-900">Welcome back</h1>
        <p className="text-sm text-ink-500 mt-1">Log in to continue your conversation with Sahayak.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          {error && <p className="text-sm text-alert-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-500">
          New here?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-ink-400">
          Demo admin: admin@vha-health.example / Admin@123
        </p>
      </div>
    </div>
  );
}
