import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password, name, role);
      if (error) toast.error(error.message);
      else toast.success("Account created! Check your email to confirm.");
    } else {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
      else navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center glow-primary">
            <Sparkles className="text-primary" size={28} />
          </div>
          <h1 className="font-display text-3xl font-bold gradient-text-primary">EduVibe</h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          {isSignUp && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">I am a</label>
                <div className="flex gap-2">
                  {(["student", "teacher"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        role === r
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-secondary/30 text-muted-foreground border border-transparent"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@school.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : isSignUp ? (
              <><UserPlus size={16} /> Sign Up</>
            ) : (
              <><LogIn size={16} /> Sign In</>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-medium hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
