import { Home, BookOpen, Swords, ShoppingBag, Building2, Shield, Sparkles, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/learning", icon: BookOpen, label: "Learning" },
  { to: "/quests", icon: Swords, label: "Quests" },
  { to: "/market", icon: ShoppingBag, label: "Market" },
  { to: "/facilities", icon: Building2, label: "Facilities" },
];

const DesktopSidebar = () => {
  const { user, role, signOut } = useAuth();

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen glass-card border-r border-glass-border/20">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
          <Sparkles className="text-primary" size={20} />
        </div>
        <h1 className="font-display text-xl font-bold gradient-text-primary">EduVibe</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}

        {(role === "teacher" || role === "admin") && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mt-4 ${
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`
            }
          >
            <Shield size={18} />
            Command Center
          </NavLink>
        )}
      </nav>

      {/* User */}
      <div className="p-4 mx-3 mb-4 glass-card rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground capitalize">{role ?? "student"}</p>
          </div>
          <button onClick={signOut} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
