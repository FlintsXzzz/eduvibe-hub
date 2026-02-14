import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useStudent } from "@/context/StudentContext";

const WalletCard = () => {
  const { state } = useStudent();

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
      </div>

      <p className="text-3xl font-display font-bold gradient-text-cyan relative z-10">
        {state.eduCoins}
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
