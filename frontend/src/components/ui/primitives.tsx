import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode, HTMLAttributes } from "react";
import { motion } from "framer-motion";

export function Card({
  children,
  className = "",
  hover = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={`rounded-3xl border border-slate-100 dark:border-white/8 bg-white dark:bg-ink-800 shadow-sm ${
        hover ? "transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "brand",
  className = "",
}: {
  children: ReactNode;
  tone?: "brand" | "care" | "accent" | "warning" | "alert" | "neutral";
  className?: string;
}) {
  const tones: Record<string, string> = {
    brand: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300",
    care: "bg-care-50 text-care-600 dark:bg-care-500/10 dark:text-care-400",
    accent: "bg-accent-100 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400",
    warning: "bg-warning-100 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500",
    alert: "bg-alert-100 text-alert-600 dark:bg-alert-500/10 dark:text-alert-400",
    neutral: "bg-slate-100 text-ink-700 dark:bg-white/5 dark:text-ink-100",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }>(
  ({ className = "", icon, ...props }, ref) => (
    <div className="relative">
      {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
      <input
        ref={ref}
        className={`w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 dark:text-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
          icon ? "pl-10" : ""
        } ${className}`}
        {...props}
      />
    </div>
  )
);
Input.displayName = "Input";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-white/10 ${className}`} />;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={center ? "text-center max-w-2xl mx-auto" : ""}
    >
      {eyebrow && (
        <span className="inline-block rounded-full bg-care-50 dark:bg-care-500/10 px-4 py-1.5 text-xs font-semibold text-care-600 dark:text-care-400 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-900 dark:text-white">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-ink-500 dark:text-ink-400 text-lg">{subtitle}</p>}
    </motion.div>
  );
}
