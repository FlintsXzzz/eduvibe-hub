import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "teacher" | "admin";

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  type: "earn" | "spend";
  date: string;
}

export interface StudentState {
  name: string;
  avatar: string;
  role: UserRole;
  xp: number;
  level: number;
  eduCoins: number;
  mood: string | null;
  transactions: Transaction[];
}

interface StudentContextType {
  state: StudentState;
  addXP: (amount: number) => void;
  spendCoins: (amount: number, label: string) => boolean;
  earnCoins: (amount: number, label: string) => void;
  setMood: (mood: string) => void;
}

const xpForLevel = (level: number) => Math.floor(100 * Math.pow(level, 1.5));

const defaultState: StudentState = {
  name: "Alex Rivera",
  avatar: "AR",
  role: "student",
  xp: 450,
  level: 3,
  eduCoins: 120,
  mood: null,
  transactions: [
    { id: "1", label: "Quest: Math Challenge", amount: 15, type: "earn", date: "Today" },
    { id: "2", label: "Cafeteria: Smoothie", amount: -8, type: "spend", date: "Today" },
    { id: "3", label: "Portfolio Export", amount: 25, type: "earn", date: "Yesterday" },
  ],
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<StudentState>(defaultState);

  const addXP = (amount: number) => {
    setState((prev) => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      while (newXP >= xpForLevel(newLevel + 1)) {
        newXP -= xpForLevel(newLevel + 1);
        newLevel++;
      }
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const earnCoins = (amount: number, label: string) => {
    setState((prev) => ({
      ...prev,
      eduCoins: prev.eduCoins + amount,
      transactions: [
        { id: Date.now().toString(), label, amount, type: "earn", date: "Now" },
        ...prev.transactions,
      ],
    }));
  };

  const spendCoins = (amount: number, label: string) => {
    if (state.eduCoins < amount) return false;
    setState((prev) => ({
      ...prev,
      eduCoins: prev.eduCoins - amount,
      transactions: [
        { id: Date.now().toString(), label, amount: -amount, type: "spend", date: "Now" },
        ...prev.transactions,
      ],
    }));
    return true;
  };

  const setMood = (mood: string) => setState((prev) => ({ ...prev, mood }));

  return (
    <StudentContext.Provider value={{ state, addXP, spendCoins, earnCoins, setMood }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within StudentProvider");
  return ctx;
};

export { xpForLevel };
