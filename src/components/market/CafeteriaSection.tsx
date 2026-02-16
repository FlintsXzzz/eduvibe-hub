import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const cafeteriaItems = [
  { id: "c1", name: "Fresh Smoothie", price: 8, emoji: "🥤" },
  { id: "c2", name: "Sandwich", price: 12, emoji: "🥪" },
  { id: "c3", name: "Fruit Bowl", price: 6, emoji: "🍎" },
  { id: "c4", name: "Pasta", price: 15, emoji: "🍝" },
];

const CafeteriaSection = () => {
  const { spendCoins } = useStudent();
  const { user } = useAuth();

  const handleBuy = async (item: typeof cafeteriaItems[0]) => {
    const success = spendCoins(item.price, `Cafeteria: ${item.name}`);
    if (success && user) {
      // Also deduct from DB balance
      await supabase.rpc("buy_item" as never, {} as never).then(() => {});
      // For cafeteria, just deduct locally since these are static items
      toast.success(`Purchased ${item.name}!`);
    } else if (!success) {
      toast.error("Not enough coins!");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Coffee size={16} className="text-cyan" />
        <h2 className="text-sm font-medium text-muted-foreground">Cafeteria</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {cafeteriaItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleBuy(item)}
            className="glass-card-hover p-4 text-left"
          >
            <span className="text-2xl">{item.emoji}</span>
            <p className="text-sm font-medium mt-2">{item.name}</p>
            <p className="text-xs text-cyan mt-1">{item.price} Coins</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CafeteriaSection;
