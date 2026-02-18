import { motion } from "framer-motion";
import WalletCard from "@/components/home/WalletCard";
import LevelProgress from "@/components/home/LevelProgress";
import TodaySchedule from "@/components/home/TodaySchedule";
import MoodCheckIn from "@/components/home/MoodCheckIn";
import PWAInstallBanner from "@/components/home/PWAInstallBanner";
import { useStudent } from "@/context/StudentContext";
import { Sparkles } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const Index = () => {
  const { state } = useStudent();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* Header */}
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Good morning ✨</p>
            <h1 className="font-display text-2xl font-bold">{state.name}</h1>
          </div>
          <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full">
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-semibold">Lvl {state.level}</span>
          </div>
        </motion.div>

        <motion.div variants={item}><PWAInstallBanner /></motion.div>
        <motion.div variants={item}><WalletCard /></motion.div>
        <motion.div variants={item}><LevelProgress /></motion.div>
        <motion.div variants={item}><MoodCheckIn /></motion.div>
        <motion.div variants={item}><TodaySchedule /></motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
