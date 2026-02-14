import { motion } from "framer-motion";
import { FolderKanban, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
}

const initialProjects: PortfolioProject[] = [
  {
    id: "p1",
    title: "Ecosystem Diorama",
    description: "3D model of a rainforest ecosystem with labeled species.",
    category: "Science",
    color: "bg-emerald/20 text-emerald",
  },
  {
    id: "p2",
    title: "Poetry Anthology",
    description: "Collection of original poems exploring identity and culture.",
    category: "Literacy",
    color: "bg-primary/20 text-primary",
  },
  {
    id: "p3",
    title: "Budget Calculator App",
    description: "A simple web app for tracking personal finances.",
    category: "Logic",
    color: "bg-cyan/20 text-cyan",
  },
  {
    id: "p4",
    title: "Community Mural",
    description: "Collaborative mural design for the school hallway.",
    category: "Creativity",
    color: "bg-amber/20 text-amber",
  },
  {
    id: "p5",
    title: "Debate Team Case",
    description: "Research brief on renewable energy policy arguments.",
    category: "Collaboration",
    color: "bg-rose/20 text-rose",
  },
];

const DigitalPortfolio = () => {
  const [exported, setExported] = useState<Set<string>>(new Set());

  const handleExport = (project: PortfolioProject) => {
    setExported((prev) => new Set(prev).add(project.id));
    toast.success(`"${project.title}" exported to Marketplace!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-emerald/20 flex items-center justify-center">
          <FolderKanban size={20} className="text-emerald" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg">Digital Portfolio</h2>
          <p className="text-xs text-muted-foreground">Showcase your projects</p>
        </div>
      </div>

      <div className="columns-1 sm:columns-2 gap-3 space-y-3">
        {initialProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + i * 0.05 }}
            className="glass-card-hover p-4 break-inside-avoid"
          >
            <div className="w-full h-24 rounded-lg bg-secondary/60 flex items-center justify-center mb-3">
              <ImageIcon size={24} className="text-muted-foreground" />
            </div>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${project.color}`}>
              {project.category}
            </span>
            <h3 className="font-display font-semibold text-sm mt-2">{project.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{project.description}</p>
            <button
              onClick={() => handleExport(project)}
              disabled={exported.has(project.id)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg transition-colors bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ExternalLink size={12} />
              {exported.has(project.id) ? "Exported" : "Export to Marketplace"}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DigitalPortfolio;
