import { useEffect, useState } from "react";
import { Store, PackageOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import MarketItemCard from "./MarketItemCard";

interface MarketItem {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  is_from_portfolio: boolean;
  seller_name?: string;
}

const MarketplaceSection = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [filter, setFilter] = useState<string>("All");

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("market_items")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      const sellerIds = [...new Set(data.map((i) => i.seller_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", sellerIds);
      const nameMap = new Map(profiles?.map((p) => [p.id, p.name]) ?? []);
      setItems(data.map((i) => ({ ...i, seller_name: nameMap.get(i.seller_id) || "Unknown" })));
    } else {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleBuy = async (itemId: string) => {
    if (!user) return;
    setBuying(true);
    const { data, error } = await supabase.rpc("buy_item", {
      _item_id: itemId,
      _buyer_id: user.id,
    });

    if (error) {
      toast.error("Purchase failed");
    } else if (data && typeof data === "object") {
      const result = data as Record<string, unknown>;
      if (result.success) {
        toast.success(`Bought "${result.item_title}" for ${result.price} coins! 🎉`);
        fetchItems();
      } else {
        toast.error(String(result.error || "Purchase failed"));
      }
    }
    setBuying(false);
  };

  const categories = ["All", "Snack", "Service", "Digital"];
  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Store size={16} className="text-primary" />
        <h2 className="text-sm font-medium text-muted-foreground">Student Marketplace</h2>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              filter === cat
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-8 flex flex-col items-center text-center">
          <PackageOpen size={32} className="text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium">No items yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            List your portfolio projects or wait for classmates to add items
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item) => (
            <MarketItemCard
              key={item.id}
              item={item}
              onBuy={handleBuy}
              isSelf={item.seller_id === user?.id}
              buying={buying}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceSection;
