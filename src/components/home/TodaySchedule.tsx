import { Clock } from "lucide-react";
import { motion } from "framer-motion";

const schedule = [
  { time: "08:00", subject: "Mathematics", room: "Room 201", color: "bg-primary/20 text-primary" },
  { time: "09:30", subject: "Physics Lab", room: "Lab A", color: "bg-cyan/20 text-cyan" },
  { time: "11:00", subject: "English Literature", room: "Room 105", color: "bg-emerald/20 text-emerald" },
  { time: "13:00", subject: "Creative Arts", room: "Studio 3", color: "bg-orange-500/20 text-orange-400" },
];

const TodaySchedule = () => {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={16} className="text-muted-foreground" />
        <h3 className="text-sm font-medium">Today's Schedule</h3>
      </div>
      <div className="space-y-2">
        {schedule.map((item, i) => (
          <motion.div
            key={item.time}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <span className="text-xs text-muted-foreground font-mono w-12">{item.time}</span>
            <div className={`w-1.5 h-8 rounded-full ${item.color.split(" ")[0]}`} />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.subject}</p>
              <p className="text-xs text-muted-foreground">{item.room}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TodaySchedule;
