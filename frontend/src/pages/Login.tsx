import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, HeartPulse, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/primitives";
import Button from "../components/ui/Button";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await login(values.email, values.password);
      toast.success("Welcome back!");
      navigate(location.state?.from || "/");
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Left: illustration panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-linear-to-br from-brand-700 via-brand-600 to-accent-600 p-12 text-white">
        <div className="absolute inset-0 opacity-20">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute rounded-full bg-white/30 blur-2xl"
              style={{
                width: 180 + i * 60,
                height: 180 + i * 60,
                top: `${10 + i * 25}%`,
                left: `${i % 2 === 0 ? -5 : 60}%`,
              }}
            />
          ))}
        </div>

        <Link to="/" className="relative flex items-center gap-2 font-display font-bold text-lg">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
            <HeartPulse size={18} />
          </span>
          Sahayak
        </Link>

        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight max-w-sm">
            Health guidance that speaks your language, day or night.
          </h2>
          <p className="mt-4 text-white/75 max-w-sm">
            Join thousands of families getting safe, clear health answers and real doctor access.
          </p>
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur px-4 py-3 max-w-sm">
            <ShieldCheck size={20} />
            <p className="text-sm text-white/90">We never diagnose — only guide you to the right care.</p>
          </div>
        </div>

        <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Sahayak Health</p>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Welcome back</h1>
          <p className="text-sm text-ink-500 mt-1">Log in to continue your conversation with Sahayak.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Email</label>
              <Input
                type="email"
                icon={<Mail size={16} />}
                placeholder="you@example.com"
                className="mt-1"
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-xs text-alert-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Password</label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  icon={<Lock size={16} />}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-alert-600">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-600 dark:text-ink-300">
                <input type="checkbox" {...register("remember")} className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                Remember me
              </label>
              <button type="button" onClick={() => toast("Password reset isn't set up in this demo yet.")} className="font-medium text-brand-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg" iconRight={<ArrowRight size={16} />}>
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            New here?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-3 text-center text-xs text-ink-400">
            Demo admin: admin@vha-health.example / Admin@123
          </p>
        </motion.div>
      </div>
    </div>
  );
}
