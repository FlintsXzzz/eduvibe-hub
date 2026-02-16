import { motion } from "framer-motion";
import { FolderKanban, ExternalLink, Image as ImageIcon, Store, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();
  const [listed, setListed] = useState<Set<string>>(new Set());
  const [toggling, setToggling] = useState<string | null>(null);

  const handleToggleMarket = async (project: PortfolioProject) => {
    if (!user) return;
    setToggling(project.id);

    if (listed.has(project.id)) {
      // Remove from marketplace
      await supabase
        .from("market_items")
        .delete()
        .eq("seller_id", user.id)
        .eq("title", project.title)
        .eq("is_from_portfolio", true);
      setListed((prev) => {
        const next = new Set(prev);
        next.delete(project.id);
        return next;
      });
      toast.success(`"${project.title}" removed from Marketplace`);
    } else {
      // Add to marketplace
      const { error } = await supabase.from("market_items").insert({
        seller_id: user.id,
        title: project.title,
        description: project.description,
        price: 20,
        category: "Digital",
        stock: 1,
        is_from_portfolio: true,
      });
      if (error) {
        toast.error("Failed to list item");
      } else {
        setListed((prev) => new Set(prev).add(project.id));
        toast.success(`"${project.title}" listed on Marketplace! 🎉`);
      }
    }
    setToggling(null);
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

            {/* List on Marketplace toggle */}
            <button
              onClick={() => handleToggleMarket(project)}
              disabled={toggling === project.id}
              className={`mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg transition-colors ${
                listed.has(project.id)
                  ? "bg-emerald/15 text-emerald border border-emerald/20"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              } disabled:opacity-40`}
            >
              {listed.has(project.id) ? (
                <>
                  <ToggleRight size={14} />
                  Listed on Market
                </>
              ) : (
                <>
                  <Store size={14} />
                  List on Marketplace
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DigitalPortfolio;
