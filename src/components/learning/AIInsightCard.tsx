import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";
import type { CompetencyData } from "./SmartGradebook";

const tips: Record<string, string> = {
  Literacy:
    "Try reading 15 minutes daily and journaling reflections — consistent practice builds strong comprehension skills.",
  Logic:
    "Work through one puzzle or logic problem each day. Apps like Brilliant or daily math challenges help sharpen reasoning.",
  Creativity:
    "Experiment with a new medium this week — sketch, write a short story, or remix a song. Creativity grows when you explore.",
  Collaboration:
    "Volunteer to lead a group discussion or pair up with a classmate on a project. Practice giving and receiving feedback.",
  Discipline:
    "Set small, timed goals (25-min focus blocks). Track your streaks — consistency compounds over time.",
};

interface AIInsightCardProps {
  data: CompetencyData[];
}

const AIInsightCard = ({ data }: AIInsightCardProps) => {
  const lowest = data.reduce((min, d) => (d.score < min.score ? d : min), data[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-5 border-primary/30 relative overflow-hidden"
    >
      {/* Subtle glow backdrop */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Sparkles size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg">AI Insight</h2>
          <p className="text-xs text-muted-foreground">Teacher's Tip</p>
        </div>
      </div>

      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-emerald" />
          <span className="text-xs font-medium text-emerald">
            Focus area: {lowest.subject} ({lowest.score}/100)
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {tips[lowest.subject] ?? "Keep up the great work across all competencies!"}
        </p>
      </div>
    </motion.div>
  );
};

export default AIInsightCard;
