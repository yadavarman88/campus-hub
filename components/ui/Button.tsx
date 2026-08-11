import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200",

    secondary:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800",

    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}