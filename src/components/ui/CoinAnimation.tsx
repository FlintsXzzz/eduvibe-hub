import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, createContext, useContext, ReactNode } from "react";

interface CoinBurst {
  id: number;
  x: number;
  y: number;
  amount: number;
}

interface CoinAnimationContextType {
  triggerCoinAnimation: (x: number, y: number, amount: number) => void;
}

const CoinAnimationContext = createContext<CoinAnimationContextType | undefined>(undefined);

/** Consumes the CoinAnimationContext. Must be called within a `CoinAnimationProvider` subtree. */
export const useCoinAnimation = () => {
  const ctx = useContext(CoinAnimationContext);
  if (!ctx) throw new Error("useCoinAnimation must be used within CoinAnimationProvider");
  return ctx;
};

export const CoinAnimationProvider = ({ children }: { children: ReactNode }) => {
  const [bursts, setBursts] = useState<CoinBurst[]>([]);

  /**
   * Spawns a coin burst at the given viewport-relative coordinates.
   * `x` / `y` should come from a `MouseEvent`'s `clientX` / `clientY`.
   * At most 6 coin sprites are rendered regardless of `amount`; the numeric
   * label always reflects the true amount. Burst cleans itself up after 1.2 s.
   */
  const triggerCoinAnimation = useCallback((x: number, y: number, amount: number) => {
    const id = Date.now();
    setBursts((prev) => [...prev, { id, x, y, amount }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 1200);
  }, []);

  return (
    <CoinAnimationContext.Provider value={{ triggerCoinAnimation }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <AnimatePresence>
          {bursts.map((burst) => (
            <CoinBurstEffect key={burst.id} burst={burst} />
          ))}
        </AnimatePresence>
      </div>
    </CoinAnimationContext.Provider>
  );
};

const CoinBurstEffect = ({ burst }: { burst: CoinBurst }) => {
  const coins = Array.from({ length: Math.min(burst.amount, 6) }, (_, i) => i);

  return (
    <>
      {coins.map((i) => {
        const angle = (i / coins.length) * Math.PI * 2 - Math.PI / 2;
        const spread = 30 + Math.random() * 20;

        return (
          <motion.div
            key={i}
            initial={{
              x: burst.x,
              y: burst.y,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: burst.x + Math.cos(angle) * spread,
              y: burst.y - 60 - Math.random() * 40,
              scale: [0, 1.2, 0.8],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.05,
              ease: "easeOut",
            }}
            className="absolute w-6 h-6"
          >
            <div className="w-full h-full rounded-full bg-amber/80 border-2 border-amber flex items-center justify-center text-[8px] font-bold text-amber-900 shadow-lg shadow-amber/30">
              ¢
            </div>
          </motion.div>
        );
      })}
      {/* Amount text */}
      <motion.div
        initial={{ x: burst.x - 20, y: burst.y - 10, opacity: 0, scale: 0.5 }}
        animate={{ y: burst.y - 50, opacity: [0, 1, 0], scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute text-sm font-bold text-amber"
      >
        +{burst.amount}
      </motion.div>
    </>
  );
};
