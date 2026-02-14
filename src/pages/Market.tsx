import { motion } from "framer-motion";
import { ShoppingBag, Coffee, Store } from "lucide-react";
import { useStudent } from "@/context/StudentContext";

const cafeteriaItems = [
  { id: "c1", name: "Fresh Smoothie", price: 8, emoji: "🥤" },
  { id: "c2", name: "Sandwich", price: 12, emoji: "🥪" },
  { id: "c3", name: "Fruit Bowl", price: 6, emoji: "🍎" },
  { id: "c4", name: "Pasta", price: 15, emoji: "🍝" },
];

const Market = () => {
  const { spendCoins } = useStudent();

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <h1 className="font-display text-2xl font-bold">Market</h1>

        {/* Cafeteria */}
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
                onClick={() => spendCoins(item.price, `Cafeteria: ${item.name}`)}
                className="glass-card-hover p-4 text-left"
              >
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-sm font-medium mt-2">{item.name}</p>
                <p className="text-xs text-cyan mt-1">{item.price} Coins</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Marketplace */}
        <div className="glass-card p-8 flex flex-col items-center text-center">
          <Store size={28} className="text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Student Marketplace</p>
          <p className="text-xs text-muted-foreground mt-1">Buy & sell student creations — coming soon</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Market;
