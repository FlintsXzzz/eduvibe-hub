import { motion } from "framer-motion";
import { Building2, CalendarDays, ScanLine, HeartPulse } from "lucide-react";

const sections = [
  { icon: CalendarDays, title: "Room Booking", desc: "Reserve labs & rooms", color: "bg-primary/20 text-primary" },
  { icon: ScanLine, title: "Attendance", desc: "Scan history & records", color: "bg-cyan/20 text-cyan" },
  { icon: HeartPulse, title: "Wellness", desc: "Mood analytics & SOS", color: "bg-emerald/20 text-emerald" },
];

const Facilities = () => (
  <div className="p-4 md:p-8 max-w-2xl mx-auto">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center gap-2">
        <Building2 size={20} className="text-primary" />
        <h1 className="font-display text-2xl font-bold">Facilities</h1>
      </div>

      <div className="space-y-3">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-5 flex items-center gap-4 cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color.split(" ")[0]}`}>
              <s.icon size={20} className={s.color.split(" ")[1]} />
            </div>
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
);

export default Facilities;
