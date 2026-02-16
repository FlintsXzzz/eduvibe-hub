import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Clock, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import EconomyOverview from "@/components/admin/EconomyOverview";
import WellnessHeatmap from "@/components/admin/WellnessHeatmap";
import InventoryManager from "@/components/admin/InventoryManager";

interface Submission {
  id: string;
  quest_title: string;
  student_id: string;
  status: string;
  xp_reward: number;
  coins_reward: number;
  submitted_at: string;
  student_name?: string;
}

interface MoodEntry {
  mood: string;
  created_at: string;
}

const moodScoreMap: Record<string, number> = {
  Great: 5, Good: 4, Okay: 3, Low: 2, Angry: 1,
};

const moodEmojis: Record<string, string> = {
  Great: "😊", Good: "🙂", Okay: "😐", Low: "😔", Angry: "😡",
};

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const { data: subs } = await supabase
      .from("quest_submissions")
      .select("*")
      .eq("status", "pending")
      .order("submitted_at", { ascending: false });

    if (subs && subs.length > 0) {
      const studentIds = [...new Set(subs.map((s) => s.student_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", studentIds);

      const nameMap = new Map(profiles?.map((p) => [p.id, p.name]) ?? []);
      setSubmissions(
        subs.map((s) => ({ ...s, student_name: nameMap.get(s.student_id) || "Student" }))
      );
    } else {
      setSubmissions([]);
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: moodData } = await supabase
      .from("mood_logs")
      .select("mood, created_at")
      .gte("created_at", weekAgo.toISOString())
      .order("created_at", { ascending: false });

    setMoods(moodData ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (sub: Submission) => {
    const { error } = await supabase
      .from("quest_submissions")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: user?.id,
      })
      .eq("id", sub.id);

    if (error) {
      toast.error("Failed to approve");
      return;
    }
    toast.success(`Approved! ${sub.xp_reward} XP & ${sub.coins_reward} coins granted to ${sub.student_name}`);
    setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
  };

  const moodCounts: Record<string, number> = {};
  moods.forEach((m) => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });

  const avgMood = moods.length > 0
    ? moods.reduce((sum, m) => sum + (moodScoreMap[m.mood] ?? 3), 0) / moods.length
    : 0;

  const trendIcon = avgMood >= 3.5
    ? <TrendingUp size={16} className="text-emerald" />
    : avgMood >= 2.5
    ? <Minus size={16} className="text-amber" />
    : <TrendingDown size={16} className="text-destructive" />;

  const trendLabel = avgMood >= 3.5 ? "Positive" : avgMood >= 2.5 ? "Neutral" : "Stressed";

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          <h1 className="font-display text-2xl font-bold">Command Center</h1>
        </div>

        {/* Quest Approval */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-5 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg">Quest Approval</h2>
              <p className="text-xs text-muted-foreground">
                {submissions.length} pending submission{submissions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Clock size={32} className="mx-auto mb-2 opacity-30" />
              No pending submissions
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/40"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{sub.quest_title}</p>
                    <p className="text-xs text-muted-foreground">
                      by {sub.student_name} · {sub.xp_reward} XP · {sub.coins_reward} coins
                    </p>
                  </div>
                  <button
                    onClick={() => handleApprove(sub)}
                    className="ml-3 shrink-0 px-3 py-1.5 rounded-lg bg-emerald/20 text-emerald text-xs font-semibold hover:bg-emerald/30 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 size={14} />
                    Approve
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Wellness Monitoring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan/20 flex items-center justify-center">
              {trendIcon}
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg">Class Mood Trend</h2>
              <p className="text-xs text-muted-foreground">
                Last 7 days · {moods.length} check-in{moods.length !== 1 ? "s" : ""} · Trend: {trendLabel}
              </p>
            </div>
          </div>

          {moods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No mood data yet
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {["Great", "Good", "Okay", "Low", "Angry"].map((mood) => {
                  const count = moodCounts[mood] || 0;
                  const pct = moods.length > 0 ? (count / moods.length) * 100 : 0;
                  return (
                    <div key={mood} className="flex items-center gap-3">
                      <span className="text-lg w-7 text-center">{moodEmojis[mood]}</span>
                      <span className="text-xs w-12 text-muted-foreground">{mood}</span>
                      <div className="flex-1 h-2 rounded-full bg-secondary/60 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className={`h-full rounded-full ${
                            mood === "Great" || mood === "Good"
                              ? "bg-emerald"
                              : mood === "Okay"
                              ? "bg-amber"
                              : "bg-destructive"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40">
                <span className="text-sm font-medium">Average Mood Score</span>
                <span className="text-lg font-bold font-display">
                  {avgMood.toFixed(1)}<span className="text-xs text-muted-foreground font-normal">/5</span>
                </span>
              </div>
            </>
          )}
        </motion.div>

        {/* Economy Overview */}
        <EconomyOverview />

        {/* Wellness Heatmap */}
        <WellnessHeatmap />

        {/* Inventory Manager */}
        <InventoryManager />
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
