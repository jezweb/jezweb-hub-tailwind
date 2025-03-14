import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "danger" | "success" | "warning" | "info" | "secondary"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  type?: "button" | "submit" | "reset"; // Button type
  className?: string; // Disabled state
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-blue-600 text-white shadow-theme-xs hover:bg-blue-700 disabled:bg-opacity-70",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    danger:
      "bg-white text-danger ring-1 ring-inset ring-danger hover:bg-danger hover:bg-opacity-10 hover:text-danger dark:bg-gray-800 dark:text-danger dark:ring-danger dark:hover:bg-danger dark:hover:bg-opacity-10",
    secondary:
      "bg-white text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-gray-700",
    success: "bg-success text-white shadow-theme-xs hover:bg-success-dark disabled:bg-opacity-70",
    warning: "bg-warning text-white shadow-theme-xs hover:bg-warning-dark disabled:bg-opacity-70",
    info: "bg-info text-white shadow-theme-xs hover:bg-info-dark disabled:bg-opacity-70",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
