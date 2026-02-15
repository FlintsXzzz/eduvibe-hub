import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const BiometricFAB = () => {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    if (scanning) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      toast.success(`Attendance marked for ${format(new Date(), "PPPP")}`);
    }, 2000);
  };

  return (
    <>
      {/* Scanning overlay */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-card p-10 flex flex-col items-center gap-5"
            >
              {/* Scanning ring animation */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/60"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border-2 border-primary/40"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
                <Fingerprint size={40} className="text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Scanning biometrics…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleScan}
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 transition-colors"
      >
        <Fingerprint size={24} />
      </motion.button>
    </>
  );
};

export default BiometricFAB;
