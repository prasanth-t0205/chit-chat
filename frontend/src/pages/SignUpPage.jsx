import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuth();

  const googleSignupMutation = useMutation({
    mutationFn: async () => {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    },
  });

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-base-100/80 backdrop-blur-lg sm:rounded-[2.5rem] p-8 sm:shadow-xl sm:border sm:border-base-200">
          <div className="space-y-5">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">Sign Up</h1>
              <p className="text-base-content/60">
                Create your account to get started
              </p>
            </div>

            <button
              onClick={() => googleSignupMutation.mutate()}
              disabled={googleSignupMutation.isPending}
              className="group relative w-full bg-base-100 h-14 rounded-2xl border-2 border-base-200 hover:border-primary flex items-center justify-center gap-2 transition-all duration-300"
            >
              <div className="absolute left-4 w-10 h-10 bg-base-100 rounded-xl flex items-center justify-center shadow-sm">
                <FcGoogle className="w-5 h-5" />
              </div>
              <span className="font-medium">Continue with Google</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-base-300 to-transparent"></div>
              <span className="text-base-content/50 text-sm font-medium">
                or
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-base-300 to-transparent"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-base-100 border-2 border-base-200 focus:border-primary transition-all duration-300"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-base-100 border-2 border-base-200 focus:border-primary transition-all duration-300"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full h-14 pl-12 pr-12 rounded-2xl bg-base-100 border-2 border-base-200 focus:border-primary transition-all duration-300"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-base-content/40" />
                      ) : (
                        <Eye className="w-5 h-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="relative w-full h-14 bg-primary text-primary-content rounded-2xl font-medium overflow-hidden group"
                disabled={isSigningUp}
              >
                <div className="absolute inset-0 bg-primary-focus transition-transform duration-300 transform translate-y-full group-hover:translate-y-0"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {isSigningUp ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </div>
              </button>
            </form>

            <p className="text-center text-base-content/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
