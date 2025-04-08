"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshSession: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const refreshSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        // Verify the session is still valid
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;

        // Update user state
        setUser(currentUser);

        // Ensure session is stored in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("supabase.auth.token", JSON.stringify(session));
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);

      // Check for existing session in localStorage
      const storedSession =
        typeof window !== "undefined"
          ? localStorage.getItem("supabase.auth.token")
          : null;

      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          if (session?.user) {
            setUser(session.user);
          }
        } catch (e) {
          console.error("Error parsing stored session:", e);
        }
      }

      // Initial session check
      refreshSession();

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {
          console.log("Auth state changed:", event, session?.user?.email);

          if (event === "SIGNED_IN") {
            if (session) {
              setUser(session.user);
              // Ensure session is stored
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "supabase.auth.token",
                  JSON.stringify(session),
                );
              }
            }
            await refreshSession();
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            if (typeof window !== "undefined") {
              localStorage.removeItem("supabase.auth.token");
            }
            setLoading(false);
          } else {
            // For other events, refresh the session
            await refreshSession();
          }
        },
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [initialized]);

  // Prevent flash of unauthenticated content
  if (loading && !initialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
