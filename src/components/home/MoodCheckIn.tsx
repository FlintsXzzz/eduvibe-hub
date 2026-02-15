import { useStudent } from "@/context/StudentContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const moods = [
  { emoji: "😊", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Low" },
  { emoji: "😡", label: "Angry" },
];

const MoodCheckIn = () => {
  const { state, setMood } = useStudent();
  const { user } = useAuth();

  const handleMood = async (label: string) => {
    setMood(label);
    if (user) {
      await supabase.from("mood_logs").insert({ user_id: user.id, mood: label });
    }
  };

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium mb-3">How are you feeling today?</h3>
      <div className="flex items-center justify-between gap-2">
        {moods.map((m) => (
          <motion.button
            key={m.label}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleMood(m.label)}
            className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all ${
              state.mood === m.label
                ? "bg-primary/15 border border-primary/30"
                : "hover:bg-secondary/50"
            }`}
          >
            <span className="text-xl">{m.emoji}</span>
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MoodCheckIn;
