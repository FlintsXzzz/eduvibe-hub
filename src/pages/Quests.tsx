import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swords, Star, CheckCircle2, Send, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";

interface QuestTemplate {
  id: string;
  title: string;
  xp: number;
  coins: number;
}

interface Submission {
  id: string;
  quest_title: string;
  xp_reward: number;
  coins_reward: number;
  status: string;
  submitted_at: string;
}

const questTemplates: QuestTemplate[] = [
  { id: "q1", title: "Complete Math Worksheet", xp: 50, coins: 10 },
  { id: "q2", title: "Submit Science Report", xp: 80, coins: 20 },
  { id: "q3", title: "Read Chapter 5", xp: 30, coins: 5 },
  { id: "q4", title: "Group Presentation Prep", xp: 100, coins: 25 },
];

const customQuestSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title must be under 100 characters"),
  xp: z.number().int().min(1).max(500),
  coins: z.number().int().min(0).max(200),
});

const Quests = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customSubmitting, setCustomSubmitting] = useState(false);

  /** Loads all of the current user's submissions ordered newest-first. */
  const fetchSubmissions = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("quest_submissions")
      .select("id, quest_title, xp_reward, coins_reward, status, submitted_at")
      .eq("student_id", user.id)
      .order("submitted_at", { ascending: false });
    setSubmissions(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  /**
   * Submits a quest template for teacher review.
   * Prevents duplicate submissions by checking for an existing `"pending"`
   * entry with the same title before inserting.
   */
  const submitQuest = async (quest: QuestTemplate) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const alreadySubmitted = submissions.some(
      (s) => s.quest_title === quest.title && s.status === "pending"
    );
    if (alreadySubmitted) {
      toast.error("You already have a pending submission for this quest");
      return;
    }

    setSubmitting(quest.id);
    const { error } = await supabase.from("quest_submissions").insert({
      student_id: user.id,
      quest_title: quest.title,
      xp_reward: quest.xp,
      coins_reward: quest.coins,
    });

    if (error) {
      toast.error("Failed to submit quest");
    } else {
      toast.success(`"${quest.title}" submitted for review!`);
      await fetchSubmissions();
    }
    setSubmitting(null);
  };

  /**
   * Submits a student-defined quest with fixed rewards (50 XP / 10 coins).
   * Rewards are intentionally fixed here; teachers can adjust them during approval.
   */
  const submitCustomQuest = async () => {
    if (!user) return;
    const result = customQuestSchema.safeParse({
      title: customTitle,
      xp: 50,
      coins: 10,
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setCustomSubmitting(true);
    const { error } = await supabase.from("quest_submissions").insert({
      student_id: user.id,
      quest_title: result.data.title,
      xp_reward: result.data.xp,
      coins_reward: result.data.coins,
    });

    if (error) {
      toast.error("Failed to submit custom quest");
    } else {
      toast.success(`Custom quest submitted for review!`);
      setCustomTitle("");
      setCustomOpen(false);
      await fetchSubmissions();
    }
    setCustomSubmitting(false);
  };

  /** Returns the most-recent submission matching `questTitle`, or `undefined` if none exists. */
  const getSubmissionStatus = (questTitle: string) => {
    return submissions.find((s) => s.quest_title === questTitle);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock size={10} /> Pending
          </span>
        );
      case "approved":
        return (
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 size={10} /> Approved
          </span>
        );
      default:
        return (
          <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords size={20} className="text-primary" />
            <h1 className="font-display text-2xl font-bold">Quests</h1>
          </div>
          <Dialog open={customOpen} onOpenChange={setCustomOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Send size={14} className="mr-1" /> Custom Quest
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a Custom Quest</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <Input
                  placeholder="Quest title (e.g. 'Extra credit essay')"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  Rewards: 50 XP & 10 Coins (teacher may adjust)
                </p>
                <Button
                  onClick={submitCustomQuest}
                  disabled={customSubmitting || customTitle.trim().length < 3}
                  className="w-full"
                >
                  {customSubmitting && <Loader2 size={14} className="mr-1 animate-spin" />}
                  Submit for Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Available Quests */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Available Quests</h2>
          {questTemplates.map((q, i) => {
            const existing = getSubmissionStatus(q.title);
            const isPending = existing?.status === "pending";
            const isApproved = existing?.status === "approved";
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`glass-card p-4 flex items-center gap-4 ${isApproved ? "opacity-50" : ""}`}
              >
                <button
                  onClick={() => submitQuest(q)}
                  disabled={!!submitting || isPending || isApproved}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isApproved
                      ? "bg-primary/20"
                      : isPending
                      ? "bg-accent"
                      : "bg-secondary hover:bg-primary/20"
                  }`}
                >
                  {submitting === q.id ? (
                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                  ) : isApproved ? (
                    <CheckCircle2 size={16} className="text-primary" />
                  ) : isPending ? (
                    <Clock size={14} className="text-muted-foreground" />
                  ) : (
                    <Send size={14} className="text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isApproved ? "line-through" : ""}`}>{q.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-primary flex items-center gap-1">
                      <Star size={10} /> {q.xp} XP
                    </span>
                    <span className="text-xs text-muted-foreground">{q.coins} Coins</span>
                  </div>
                </div>
                {existing && statusBadge(existing.status)}
              </motion.div>
            );
          })}
        </div>

        {/* Submission History */}
        {!loading && submissions.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">My Submissions</h2>
            {submissions.map((s) => (
              <div key={s.id} className="glass-card p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{s.quest_title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(s.submitted_at).toLocaleDateString()}
                    {" · "}
                    {s.xp_reward} XP & {s.coins_reward} Coins
                  </p>
                </div>
                {statusBadge(s.status)}
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Quests;
