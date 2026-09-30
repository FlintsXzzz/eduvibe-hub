import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subDays } from "date-fns";

interface DayData {
  date: string;
  volume: number;
  circulation: number;
}

/**
 * Admin widget showing EduCoin transaction volume per day over the last 7 days
 * as a line chart, plus the current total coins in circulation (sum of all
 * profile balances). Circulation is a point-in-time snapshot — the same value
 * is repeated for every day on the chart.
 */
const EconomyOverview = () => {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const sevenDaysAgo = subDays(new Date(), 7).toISOString();

      // Fetch transactions from last 7 days
      const { data: txs } = await supabase
        .from("transactions")
        .select("amount, created_at")
        .gte("created_at", sevenDaysAgo)
        .order("created_at", { ascending: true });

      // Fetch total balance in circulation
      const { data: profiles } = await supabase
        .from("profiles")
        .select("balance");

      const totalCirculation = profiles?.reduce((sum, p) => sum + (p.balance ?? 0), 0) ?? 0;

      // Group by day
      const dayMap = new Map<string, number>();
      for (let i = 6; i >= 0; i--) {
        const day = format(subDays(new Date(), i), "MMM dd");
        dayMap.set(day, 0);
      }

      txs?.forEach((tx) => {
        const day = format(new Date(tx.created_at), "MMM dd");
        if (dayMap.has(day)) {
          dayMap.set(day, (dayMap.get(day) ?? 0) + tx.amount);
        }
      });

      const chartData = Array.from(dayMap.entries()).map(([date, volume]) => ({
        date,
        volume,
        circulation: totalCirculation,
      }));

      setData(chartData);
      setLoading(false);
    };

    fetchData();
  }, []);

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
      transition={{ delay: 0.15 }}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
          <Coins size={20} className="text-amber" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg">Economy Overview</h2>
          <p className="text-xs text-muted-foreground">Last 7 days</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-secondary/40">
          <p className="text-xs text-muted-foreground">Coins in Circulation</p>
          <p className="text-xl font-bold font-display gradient-text-cyan">
            {data[data.length - 1]?.circulation ?? 0}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/40">
          <p className="text-xs text-muted-foreground">Today's Volume</p>
          <p className="text-xl font-bold font-display gradient-text-primary flex items-center gap-1">
            <TrendingUp size={14} className="text-emerald" />
            {data[data.length - 1]?.volume ?? 0}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line type="monotone" dataKey="volume" stroke="hsl(262, 83%, 58%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default EconomyOverview;
