import { motion } from "framer-motion";
import { BookOpen, BarChart3, FolderKanban } from "lucide-react";

const Learning = () => (
  <div className="p-4 md:p-8 max-w-2xl mx-auto">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <h1 className="font-display text-2xl font-bold">Learning</h1>

      <div className="glass-card-hover p-5 flex items-center gap-4 cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <BarChart3 size={20} className="text-primary" />
        </div>
        <div>
          <p className="font-medium">Smart Gradebook</p>
          <p className="text-xs text-muted-foreground">Radar chart of your competencies</p>
        </div>
      </div>

      <div className="glass-card-hover p-5 flex items-center gap-4 cursor-pointer">
        <div className="w-10 h-10 rounded-xl bg-emerald/20 flex items-center justify-center">
          <FolderKanban size={20} className="text-emerald" />
        </div>
        <div>
          <p className="font-medium">Digital Portfolio</p>
          <p className="text-xs text-muted-foreground">Showcase your projects</p>
        </div>
      </div>

      <div className="glass-card p-12 flex flex-col items-center text-center">
        <BookOpen size={32} className="text-muted-foreground mb-3" />
        <p className="text-muted-foreground text-sm">Full learning modules coming soon</p>
      </div>
    </motion.div>
  </div>
);

export default Learning;
