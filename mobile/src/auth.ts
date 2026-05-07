// Eenvoudige auth-context. In productie: korte JWT van /api/auth/pin.
// Voor de MVP-frontend werken we tegen een mock-API (zie api/mock.ts).

import { createContext, useContext, useEffect, useState } from 'react';

export type Session = {
  userId: string;
  displayName: string;
  employeeCode: string;
  token: string;
  expiresAt: number;
};

const KEY = 'gom.session';

const Ctx = createContext<{
  session: Session | null;
  setSession: (s: Session | null) => void;
}>({ session: null, setSession: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() => {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
      const s = JSON.parse(raw) as Session;
      if (s.expiresAt < Date.now()) return null;
      return s;
    } catch {
      return null;
    }
  });

  const setSession = (s: Session | null) => {
    setSessionState(s);
    if (s) localStorage.setItem(KEY, JSON.stringify(s));
    else localStorage.removeItem(KEY);
  };

  useEffect(() => {
    if (!session) return;
    const ms = session.expiresAt - Date.now();
    if (ms <= 0) {
      setSession(null);
      return;
    }
    const t = setTimeout(() => setSession(null), ms);
    return () => clearTimeout(t);
  }, [session]);

  return <Ctx.Provider value={{ session, setSession }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
