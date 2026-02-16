import { motion } from "framer-motion";
import { ShoppingCart, Package } from "lucide-react";

interface MarketItemCardProps {
  item: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: string;
    stock: number;
    image_url: string | null;
    is_from_portfolio: boolean;
    seller_name?: string;
  };
  onBuy: (itemId: string) => void;
  isSelf: boolean;
  buying: boolean;
}

const categoryColors: Record<string, string> = {
  Snack: "bg-amber/20 text-amber",
  Service: "bg-primary/20 text-primary",
  Digital: "bg-cyan/20 text-cyan",
};

const MarketItemCard = ({ item, onBuy, isSelf, buying }: MarketItemCardProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card-hover p-4 flex flex-col"
  >
    <div className="w-full h-24 rounded-lg bg-secondary/60 flex items-center justify-center mb-3">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover rounded-lg" />
      ) : (
        <Package size={24} className="text-muted-foreground" />
      )}
    </div>
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full self-start ${categoryColors[item.category] || "bg-secondary text-muted-foreground"}`}>
      {item.category}
    </span>
    <h3 className="font-display font-semibold text-sm mt-2 truncate">{item.title}</h3>
    {item.description && (
      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
    )}
    <p className="text-[11px] text-muted-foreground mt-1">
      by {item.seller_name ?? "Unknown"} · {item.stock} left
    </p>
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-glass-border/10">
      <span className="text-sm font-bold gradient-text-cyan">{item.price} Coins</span>
      <button
        onClick={() => onBuy(item.id)}
        disabled={isSelf || item.stock <= 0 || buying}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ShoppingCart size={12} />
        {item.stock <= 0 ? "Sold Out" : isSelf ? "Your Item" : "Buy"}
      </button>
    </div>
  </motion.div>
);

export default MarketItemCard;
