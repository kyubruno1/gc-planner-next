import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "primary";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "default", className = "", ...props }, ref) => {
    const baseClasses = "p-5 rounded-md font-bold text-md cursor-pointer shadow-lg";
    let variantClasses = "";

    if (variant === "default") {
      variantClasses = "bg-gradient-to-t from-bghovermodal to-bgtextdark text-gold hover:bg-bgpagelight text-shadow-title";
    } else if (variant === "outline") {
      variantClasses = "border border-gold text-gold hover:bg-gold hover:text-bgtextdark";
    } else if (variant === "primary") {
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700";
    }

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
