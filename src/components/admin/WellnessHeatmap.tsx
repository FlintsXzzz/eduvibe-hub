import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Heart, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";

const moodScoreMap: Record<string, number> = {
  Great: 5, Good: 4, Okay: 3, Low: 2, Angry: 1,
};

interface DayMood {
  date: string;
  avg: number;
  count: number;
}

const WellnessHeatmap = () => {
  const [days, setDays] = useState<DayMood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();
      const { data } = await supabase
        .from("mood_logs")
        .select("mood, created_at")
        .gte("created_at", sevenDaysAgo);

      const dayMap = new Map<string, number[]>();
      for (let i = 6; i >= 0; i--) {
        const day = format(subDays(new Date(), i), "EEE");
        dayMap.set(day, []);
      }

      data?.forEach((m) => {
        const day = format(new Date(m.created_at), "EEE");
        const score = moodScoreMap[m.mood] ?? 3;
        if (dayMap.has(day)) {
          dayMap.get(day)!.push(score);
        }
      });

      const result = Array.from(dayMap.entries()).map(([date, scores]) => ({
        date,
        avg: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
        count: scores.length,
      }));

      setDays(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getColor = (avg: number) => {
    if (avg === 0) return "bg-secondary/40";
    if (avg >= 4) return "bg-emerald/40 border-emerald/30";
    if (avg >= 3) return "bg-amber/30 border-amber/20";
    return "bg-destructive/30 border-destructive/20";
  };

  const getIcon = (avg: number) => {
    if (avg === 0) return null;
    if (avg >= 4) return <Smile size={14} className="text-emerald" />;
    if (avg >= 3) return <Heart size={14} className="text-amber" />;
    return <AlertTriangle size={14} className="text-destructive" />;
  };

  if (loading) {
    return (
      <div className="glass-card p-5 flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const stressedDays = days.filter((d) => d.avg > 0 && d.avg < 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose/20 flex items-center justify-center">
          <Heart size={20} className="text-rose" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg">Wellness Heatmap</h2>
          <p className="text-xs text-muted-foreground">
            {stressedDays.length > 0
              ? `⚠️ ${stressedDays.length} stressed day${stressedDays.length > 1 ? "s" : ""} detected`
              : "Class is feeling good! 🎉"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.date}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${getColor(day.avg)}`}
          >
            <span className="text-[10px] text-muted-foreground font-medium">{day.date}</span>
            {getIcon(day.avg) ?? <div className="h-3.5" />}
            <span className="text-[10px] font-semibold">
              {day.avg > 0 ? day.avg.toFixed(1) : "—"}
            </span>
            <span className="text-[8px] text-muted-foreground">{day.count} logs</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald/40" /> ≥ 4.0 Good</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber/30" /> 3.0-3.9</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-destructive/30" /> &lt; 3.0 Stressed</span>
      </div>
    </motion.div>
  );
};

export default WellnessHeatmap;
