import { Zap } from "lucide-react";
import { useStudent, xpForLevel } from "@/context/StudentContext";

const LevelProgress = () => {
  const { state } = useStudent();
  const nextLevelXP = xpForLevel(state.level + 1);
  const progress = (state.xp / nextLevelXP) * 100;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald/20 flex items-center justify-center">
            <Zap size={16} className="text-emerald" />
          </div>
          <span className="text-sm text-muted-foreground">Level {state.level}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {state.xp} / {nextLevelXP} XP
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald to-green-400 transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {Math.ceil(nextLevelXP - state.xp)} XP to Level {state.level + 1}
      </p>
    </div>
  );
};

export default LevelProgress;
