import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import CafeteriaSection from "@/components/market/CafeteriaSection";
import MarketplaceSection from "@/components/market/MarketplaceSection";

const Market = () => {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} className="text-primary" />
          <h1 className="font-display text-2xl font-bold">Market</h1>
        </div>

        <CafeteriaSection />
        <MarketplaceSection />
      </motion.div>
    </div>
  );
};

export default Market;
