import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export interface CompetencyData {
  subject: string;
  score: number;
  fullMark: number;
}

interface SmartGradebookProps {
  data: CompetencyData[];
}

const SmartGradebook = ({ data }: SmartGradebookProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="glass-card p-5"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
        <BarChart3 size={20} className="text-primary" />
      </div>
      <div>
        <h2 className="font-display font-semibold text-lg">Smart Gradebook</h2>
        <p className="text-xs text-muted-foreground">Your competency radar</p>
      </div>
    </div>

    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid
            stroke="hsl(var(--glass-border) / 0.15)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Competency"
            dataKey="score"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  </motion.div>
);

export default SmartGradebook;
