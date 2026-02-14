import { motion } from "framer-motion";
import { Swords, Star, CheckCircle2 } from "lucide-react";
import { useStudent } from "@/context/StudentContext";

const questList = [
  { id: "q1", title: "Complete Math Worksheet", xp: 50, coins: 10, done: false },
  { id: "q2", title: "Submit Science Report", xp: 80, coins: 20, done: false },
  { id: "q3", title: "Read Chapter 5", xp: 30, coins: 5, done: true },
  { id: "q4", title: "Group Presentation Prep", xp: 100, coins: 25, done: false },
];

const Quests = () => {
  const { addXP, earnCoins } = useStudent();

  const handleComplete = (quest: typeof questList[0]) => {
    if (quest.done) return;
    addXP(quest.xp);
    earnCoins(quest.coins, `Quest: ${quest.title}`);
    quest.done = true;
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex items-center gap-2">
          <Swords size={20} className="text-primary" />
          <h1 className="font-display text-2xl font-bold">Quests</h1>
        </div>

        <div className="space-y-3">
          {questList.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`glass-card p-4 flex items-center gap-4 ${q.done ? "opacity-50" : ""}`}
            >
              <button
                onClick={() => handleComplete(q)}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  q.done ? "bg-emerald/20" : "bg-secondary hover:bg-primary/20"
                }`}
              >
                <CheckCircle2 size={16} className={q.done ? "text-emerald" : "text-muted-foreground"} />
              </button>
              <div className="flex-1">
                <p className={`text-sm font-medium ${q.done ? "line-through" : ""}`}>{q.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-emerald flex items-center gap-1">
                    <Star size={10} /> {q.xp} XP
                  </span>
                  <span className="text-xs text-cyan">{q.coins} Coins</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Quests;
