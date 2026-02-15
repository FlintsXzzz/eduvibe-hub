import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, FlaskConical, Music, BookOpen, Clock, Check } from "lucide-react";
import { toast } from "sonner";

interface Facility {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
}

const facilities: Facility[] = [
  { id: "lab", name: "Science Lab", icon: FlaskConical, color: "bg-primary/20 text-primary" },
  { id: "music", name: "Music Room", icon: Music, color: "bg-cyan/20 text-cyan" },
  { id: "library", name: "Library", icon: BookOpen, color: "bg-emerald/20 text-emerald" },
];

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];

const FacilityBooking = () => {
  const [selected, setSelected] = useState<{ facility: string; slot: string } | null>(null);
  const [booked, setBooked] = useState<Set<string>>(new Set());

  const handleBook = () => {
    if (!selected) return;
    const key = `${selected.facility}-${selected.slot}`;
    setBooked((prev) => new Set(prev).add(key));
    toast.success(`Booked ${facilities.find((f) => f.id === selected.facility)?.name} at ${selected.slot}`);
    setSelected(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <CalendarDays size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-lg">Room Booking</h2>
          <p className="text-xs text-muted-foreground">Select a facility & time slot</p>
        </div>
      </div>

      {/* Facility selector */}
      <div className="flex gap-2">
        {facilities.map((f) => {
          const isActive = selected?.facility === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelected((prev) => ({ facility: f.id, slot: prev?.slot ?? "" }))}
              className={`flex-1 glass-card p-3 flex flex-col items-center gap-2 transition-all duration-200 ${
                isActive ? "border-primary/60 shadow-lg shadow-primary/10" : ""
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${f.color.split(" ")[0]}`}>
                <f.icon size={18} className={f.color.split(" ")[1]} />
              </div>
              <span className="text-xs font-medium">{f.name}</span>
            </button>
          );
        })}
      </div>

      {/* Time-slot grid */}
      <div className="grid grid-cols-4 gap-2">
        {timeSlots.map((slot) => {
          const key = `${selected?.facility}-${slot}`;
          const isBooked = booked.has(key);
          const isSelected = selected?.facility && selected?.slot === slot;

          return (
            <button
              key={slot}
              disabled={!selected?.facility || isBooked}
              onClick={() =>
                setSelected((prev) => (prev ? { ...prev, slot } : null))
              }
              className={`glass-card p-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 ${
                isBooked
                  ? "opacity-40 cursor-not-allowed"
                  : isSelected
                  ? "border-primary/60 text-primary"
                  : "hover:border-primary/30"
              }`}
            >
              {isBooked ? <Check size={12} className="text-emerald" /> : <Clock size={12} className="text-muted-foreground" />}
              {slot}
            </button>
          );
        })}
      </div>

      {/* Book button */}
      <button
        disabled={!selected?.facility || !selected?.slot}
        onClick={handleBook}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Book Now
      </button>
    </motion.div>
  );
};

export default FacilityBooking;
