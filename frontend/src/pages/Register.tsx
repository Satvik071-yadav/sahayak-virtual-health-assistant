import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, HeartPulse, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/primitives";
import Button from "../components/ui/Button";

const schema = z.object({
  full_name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(6, "At least 6 characters")
    .max(128),
  preferred_language: z.enum(["en", "hi"]),
});
type FormValues = z.infer<typeof schema>;

function getStrength(password: string) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const strengthLabels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
const strengthColors = ["bg-alert-500", "bg-warning-500", "bg-warning-500", "bg-care-500", "bg-success-500"];

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { preferred_language: "en" },
    mode: "onChange",
  });

  const password = watch("password") || "";
  const strength = getStrength(password);

  const fieldsFilled = ["full_name", "email", "password"].filter(
    (f) => dirtyFields[f as keyof typeof dirtyFields]
  ).length;
  const progress = Math.round((fieldsFilled / 3) * 100);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await registerUser(values);
      setSuccess(true);
      toast.success("Account created!");
      setTimeout(() => navigate("/"), 1400);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-16 order-2 lg:order-1">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                >
                  <CheckCircle2 className="mx-auto text-success-500" size={60} />
                </motion.div>
                <p className="mt-4 font-display text-xl font-bold text-ink-900 dark:text-white">You're all set!</p>
                <p className="text-sm text-ink-500 mt-1">Taking you to Sahayak…</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Create your account</h1>
                <p className="text-sm text-ink-500 mt-1">It only takes a minute.</p>

                <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-brand-500 to-care-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Full name</label>
                    <Input icon={<User size={16} />} placeholder="Your name" className="mt-1" {...register("full_name")} />
                    {errors.full_name && <p className="mt-1 text-xs text-alert-600">{errors.full_name.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Email</label>
                    <Input type="email" icon={<Mail size={16} />} placeholder="you@example.com" className="mt-1" {...register("email")} />
                    {errors.email && <p className="mt-1 text-xs text-alert-600">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Phone (optional)</label>
                    <Input icon={<Phone size={16} />} placeholder="+91-" className="mt-1" {...register("phone")} />
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
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                i < strength ? strengthColors[strength] : "bg-slate-200 dark:bg-white/10"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-ink-500">{strengthLabels[strength]}</p>
                      </div>
                    )}
                    {errors.password && <p className="mt-1 text-xs text-alert-600">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink-700 dark:text-ink-200">Preferred language</label>
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      {...register("preferred_language")}
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी</option>
                    </select>
                  </div>

                  <Button type="submit" loading={loading} className="w-full" size="lg" icon={<Sparkles size={16} />}>
                    Sign up
                  </Button>
                </form>

                <p className="mt-5 text-center text-sm text-ink-500">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-brand-600 hover:underline">
                    Log in
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-linear-to-br from-care-600 via-brand-600 to-accent-600 p-12 text-white order-1 lg:order-2">
        <div className="absolute inset-0 opacity-20">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
              transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute rounded-full bg-white/30 blur-2xl"
              style={{ width: 160 + i * 60, height: 160 + i * 60, top: `${15 + i * 22}%`, right: `${i % 2 === 0 ? -5 : 55}%` }}
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
          <h2 className="font-display text-3xl font-bold leading-tight max-w-sm">Join 10,000+ families getting better health guidance.</h2>
          <p className="mt-4 text-white/75 max-w-sm">Free forever for patients. Set up in under a minute.</p>
        </div>
        <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Sahayak Health</p>
      </div>
    </div>
  );
}
