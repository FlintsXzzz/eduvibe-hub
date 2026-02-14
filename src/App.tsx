import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudentProvider } from "@/context/StudentContext";
import MainLayout from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Learning from "./pages/Learning";
import Quests from "./pages/Quests";
import Market from "./pages/Market";
import Facilities from "./pages/Facilities";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StudentProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/market" element={<Market />} />
              <Route path="/facilities" element={<Facilities />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StudentProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
