import { motion } from "framer-motion";
import { ClipboardList, CheckCircle2, XCircle } from "lucide-react";

interface AttendanceRecord {
  date: string;
  status: "present" | "absent";
  time?: string;
}

const records: AttendanceRecord[] = [
  { date: "Mon, Feb 10", status: "present", time: "07:52" },
  { date: "Tue, Feb 11", status: "present", time: "07:48" },
  { date: "Wed, Feb 12", status: "absent" },
  { date: "Thu, Feb 13", status: "present", time: "07:55" },
  { date: "Fri, Feb 14", status: "present", time: "07:50" },
];

const AttendanceHistory = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="glass-card p-5 space-y-4"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-cyan/20 flex items-center justify-center">
        <ClipboardList size={20} className="text-cyan" />
      </div>
      <div>
        <h2 className="font-display font-semibold text-lg">Attendance History</h2>
        <p className="text-xs text-muted-foreground">This week's records</p>
      </div>
    </div>

    <div className="space-y-2">
      {records.map((r, i) => (
        <motion.div
          key={r.date}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between p-3 rounded-lg bg-secondary/40"
        >
          <div className="flex items-center gap-3">
            {r.status === "present" ? (
              <CheckCircle2 size={16} className="text-emerald" />
            ) : (
              <XCircle size={16} className="text-destructive" />
            )}
            <span className="text-sm font-medium">{r.date}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {r.time ?? "—"}
          </span>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default AttendanceHistory;
