import { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "link";
  size?: "default" | "sm" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClass = "form-button";

    let variantClass = "";
    if (variant === "outline") {
      variantClass = "logout-button";
    } else if (variant === "link") {
      variantClass = "auth-link";
    }

    const buttonClass = `${baseClass} ${variantClass} ${className || ""}`;

    return <button className={buttonClass} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button };
