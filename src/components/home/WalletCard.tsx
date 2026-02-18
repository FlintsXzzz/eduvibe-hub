import { Wallet, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { useStudent } from "@/context/StudentContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const WalletCard = () => {
  const { state } = useStudent();
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBalance(null);
      setLoading(false);
      return;
    }

    // Initial fetch
    const fetchBalance = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .maybeSingle();
      if (data) setBalance(data.balance);
      setLoading(false);
    };
    fetchBalance();

    // Real-time subscription
    const channel = supabase
      .channel(`wallet-balance-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as { balance: number };
          setBalance(updated.balance);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const displayBalance = user ? (loading ? null : balance) : state.eduCoins;

  return (
    <div className="glass-card p-5 relative overflow-hidden">
      {/* Glow accent */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan/20 rounded-full blur-3xl" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan/20 flex items-center justify-center">
            <Wallet size={16} className="text-cyan" />
          </div>
          <span className="text-sm text-muted-foreground">EduCoins</span>
        </div>
        {user && loading && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
      </div>

      <p className="text-3xl font-display font-bold gradient-text-cyan relative z-10">
        {displayBalance === null ? (
          <span className="text-muted-foreground text-xl">—</span>
        ) : (
          displayBalance
        )}
      </p>

      {/* Transaction list */}
      <div className="mt-4 space-y-2 relative z-10">
        {state.transactions.slice(0, 3).map((tx) => (
          <div key={tx.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {tx.type === "earn" ? (
                <ArrowDownLeft size={14} className="text-emerald" />
              ) : (
                <ArrowUpRight size={14} className="text-destructive" />
              )}
              <span className="text-muted-foreground truncate max-w-[180px]">{tx.label}</span>
            </div>
            <span className={tx.type === "earn" ? "text-emerald font-medium" : "text-destructive font-medium"}>
              {tx.amount > 0 ? "+" : ""}{tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletCard;
