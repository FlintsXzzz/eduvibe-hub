import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import FacilityBooking from "@/components/facilities/FacilityBooking";
import AttendanceHistory from "@/components/facilities/AttendanceHistory";
import BiometricFAB from "@/components/facilities/BiometricFAB";

const Facilities = () => (
  <div className="p-4 md:p-8 max-w-2xl mx-auto pb-28">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center gap-2">
        <Building2 size={20} className="text-primary" />
        <h1 className="font-display text-2xl font-bold">Facilities</h1>
      </div>

      <FacilityBooking />
      <AttendanceHistory />
    </motion.div>

    <BiometricFAB />
  </div>
);

export default Facilities;
