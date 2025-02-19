import { useContext, createContext } from "react";

// Define the Theme type
export type Theme = "dark" | "light" | "system";

// Define the ThemeProviderState type
export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Define the initial state
export const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

// Create the ThemeProviderContext
export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Define the useTheme hook
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};