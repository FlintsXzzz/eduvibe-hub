import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Plus, Minus, Save, PackageOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MarketItem {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  seller_id: string;
}

const InventoryManager = () => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState<Map<string, { price?: number; stock?: number }>>(new Map());

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("market_items")
        .select("id, title, price, stock, category, seller_id")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setItems((data as MarketItem[]) ?? []);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const updateEdit = (id: string, field: "price" | "stock", value: number) => {
    setEdits((prev) => {
      const next = new Map(prev);
      const current = next.get(id) ?? {};
      current[field] = Math.max(0, value);
      next.set(id, current);
      return next;
    });
  };

  const saveItem = async (item: MarketItem) => {
    const edit = edits.get(item.id);
    if (!edit) return;

    const { error } = await supabase
      .from("market_items")
      .update({
        price: edit.price ?? item.price,
        stock: edit.stock ?? item.stock,
      })
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(`"${item.title}" updated!`);
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, price: edit.price ?? i.price, stock: edit.stock ?? i.stock }
            : i
        )
      );
      setEdits((prev) => {
        const next = new Map(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-5 flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald/20 flex items-center justify-center">
          <Package size={20} className="text-emerald" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg">Inventory</h2>
          <p className="text-xs text-muted-foreground">{items.length} items in stock</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <PackageOpen size={32} className="mx-auto mb-2 opacity-30" />
          No items in inventory
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const edit = edits.get(item.id);
            const currentPrice = edit?.price ?? item.price;
            const currentStock = edit?.stock ?? item.stock;
            const hasChanges = edit !== undefined;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <span className="text-[10px] text-muted-foreground uppercase">{item.category}</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateEdit(item.id, "price", currentPrice - 1)}
                    className="w-6 h-6 rounded bg-secondary/60 flex items-center justify-center hover:bg-secondary/80"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="text-xs font-medium w-10 text-center">{currentPrice}c</span>
                  <button
                    onClick={() => updateEdit(item.id, "price", currentPrice + 1)}
                    className="w-6 h-6 rounded bg-secondary/60 flex items-center justify-center hover:bg-secondary/80"
                  >
                    <Plus size={10} />
                  </button>
                </div>

                {/* Stock */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateEdit(item.id, "stock", currentStock - 1)}
                    className="w-6 h-6 rounded bg-secondary/60 flex items-center justify-center hover:bg-secondary/80"
                  >
                    <Minus size={10} />
                  </button>
                  <span className="text-xs font-medium w-8 text-center">{currentStock}</span>
                  <button
                    onClick={() => updateEdit(item.id, "stock", currentStock + 1)}
                    className="w-6 h-6 rounded bg-secondary/60 flex items-center justify-center hover:bg-secondary/80"
                  >
                    <Plus size={10} />
                  </button>
                </div>

                {hasChanges && (
                  <button
                    onClick={() => saveItem(item)}
                    className="p-1.5 rounded-lg bg-emerald/20 text-emerald hover:bg-emerald/30 transition-colors"
                  >
                    <Save size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default InventoryManager;
