import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "glass";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-linear-to-r from-brand-600 to-accent-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:brightness-110",
  secondary:
    "bg-care-500 text-white shadow-lg shadow-care-500/20 hover:bg-care-600",
  outline:
    "border-2 border-brand-500/30 text-brand-600 dark:text-brand-300 hover:bg-brand-500/5 dark:hover:bg-brand-500/10",
  ghost: "text-ink-700 dark:text-ink-100 hover:bg-black/5 dark:hover:bg-white/5",
  danger: "bg-alert-500 text-white shadow-lg shadow-alert-500/25 hover:bg-alert-600",
  glass: "glass text-ink-900 dark:text-white hover:bg-white/90 dark:hover:bg-white/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
  > {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", loading, icon, iconRight, className = "", children, disabled, ...props },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2, scale: 1.015 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...(props as any)}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : icon}
        {children}
        {!loading && iconRight}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
