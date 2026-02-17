import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudentProvider } from "@/context/StudentContext";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CoinAnimationProvider } from "@/components/ui/CoinAnimation";
import { SpeedInsights } from "@vercel/speed-insights/react";
import MainLayout from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Learning from "./pages/Learning";
import Quests from "./pages/Quests";
import Market from "./pages/Market";
import Facilities from "./pages/Facilities";
import TeacherDashboard from "./pages/TeacherDashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const TeacherRoute = ({ children }: { children: React.ReactNode }) => {
  const { role, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (role !== "teacher" && role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StudentProvider>
          <CoinAnimationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/" element={<Index />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/quests" element={<Quests />} />
                  <Route path="/market" element={<Market />} />
                  <Route path="/facilities" element={<Facilities />} />
                  <Route path="/admin" element={<TeacherRoute><TeacherDashboard /></TeacherRoute>} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <SpeedInsights />
          </CoinAnimationProvider>
        </StudentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
