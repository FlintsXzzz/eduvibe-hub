import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coffee, ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const emojiMap: Record<string, string> = {
  "Fresh Smoothie": "🥤",
  "Sandwich": "🥪",
  "Fruit Bowl": "🍎",
  "Pasta": "🍝",
};

interface CafeteriaItem {
  id: string;
  title: string;
  price: number;
  stock: number;
}

const CafeteriaSection = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<CafeteriaItem[]>([]);
  const [buying, setBuying] = useState<string | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("market_items")
      .select("id, title, price, stock")
      .eq("category", "Snack")
      .eq("is_active", true)
      .order("price", { ascending: true });
    setItems(data ?? []);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleBuy = async (item: CafeteriaItem) => {
    if (!user) return;
    setBuying(item.id);
    const { data, error } = await supabase.rpc("buy_item", {
      _item_id: item.id,
      _buyer_id: user.id,
    });

    if (error) {
      toast.error(error.message || "Purchase failed");
    } else if (data && Array.isArray(data) && data.length > 0) {
      toast.success(`Purchased ${item.title}! Balance: ${data[0].new_balance} coins 🎉`);
      fetchItems();
    }
    setBuying(null);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Coffee size={16} className="text-cyan" />
        <h2 className="text-sm font-medium text-muted-foreground">Cafeteria</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleBuy(item)}
            disabled={buying === item.id || item.stock <= 0}
            className="glass-card-hover p-4 text-left relative disabled:opacity-50"
          >
            <span className="text-2xl">{emojiMap[item.title] || "🍽️"}</span>
            <p className="text-sm font-medium mt-2">{item.title}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-cyan">{item.price} Coins</p>
              {buying === item.id ? (
                <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <ShoppingCart size={12} className="text-muted-foreground" />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CafeteriaSection;
