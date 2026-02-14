import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useMemo } from "react";
import { useStudent } from "@/context/StudentContext";
import SmartGradebook, { CompetencyData } from "@/components/learning/SmartGradebook";
import DigitalPortfolio from "@/components/learning/DigitalPortfolio";
import AIInsightCard from "@/components/learning/AIInsightCard";

// Base scores + bonus from completed quest count
const baseScores: Record<string, number> = {
  Literacy: 55,
  Logic: 40,
  Creativity: 65,
  Collaboration: 50,
  Discipline: 35,
};

const Learning = () => {
  const { state } = useStudent();

  // Completed quests boost all scores slightly, simulating reactive data
  const completedQuests = state.transactions.filter(
    (t) => t.type === "earn" && t.label.startsWith("Quest:")
  ).length;

  const competencyData: CompetencyData[] = useMemo(
    () =>
      Object.entries(baseScores).map(([subject, base]) => ({
        subject,
        score: Math.min(100, base + completedQuests * 5),
        fullMark: 100,
      })),
    [completedQuests]
  );

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-primary" />
          <h1 className="font-display text-2xl font-bold">Learning</h1>
        </div>

        <SmartGradebook data={competencyData} />
        <AIInsightCard data={competencyData} />
        <DigitalPortfolio />
      </motion.div>
    </div>
  );
};

export default Learning;
