import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import "../styles/auth.css";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login form data:", data);
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(data);
      console.log("Login successful:", response);

      // Call the login function from context to update auth state
      login(response);

      console.log("Redirecting based on role:", response.user.role);

      // Redirect based on user role
      switch (response.user.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "INSTRUCTOR":
          navigate("/instructor/dashboard");
          break;
        case "USER":
          navigate("/user/dashboard");
          break;
        default:
          console.warn("Unknown role:", response.user.role);
          navigate("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle API error response
      if (err.response?.data) {
        setError(
          err.response.data.message || "Failed to login. Please try again."
        );
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "error" : ""}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className={errors.password ? "error" : ""}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <a href="/register" className="auth-link">
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
