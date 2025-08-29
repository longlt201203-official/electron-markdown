import {
  NATIVE_API_READ_SETTINGS,
  NATIVE_API_SAVE_SETTINGS,
} from "@/native/constants";
import { AppSettings } from "@/native/types";
import { createContext, useContext, useEffect, useState } from "react";
// Dynamically switch highlight.js theme assets
import hljsLightThemeHref from "highlight.js/styles/stackoverflow-light.min.css?url";
import hljsDarkThemeHref from "highlight.js/styles/github-dark-dimmed.min.css?url";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const getDarkOrLightTheme = (theme: Theme) => {
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    return systemTheme;
  }
  if (theme === "dark") return "dark";
  if (theme === "light") return "light";
  return "light";
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    nativeAPI
      .invokeNativeAPI(NATIVE_API_READ_SETTINGS)
      .then((settings: AppSettings) => {
        setTheme((settings.theme as Theme) || defaultTheme);
      });
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    const darkOrLightTheme = getDarkOrLightTheme(theme);

    root.classList.add(darkOrLightTheme);

    // Manage highlight.js theme link
    const applyHighlightTheme = () => {
      const resolved = getDarkOrLightTheme(theme);
      let link = document.getElementById(
        "hljs-theme"
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.id = "hljs-theme";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      const nextHref =
        resolved === "dark" ? hljsDarkThemeHref : hljsLightThemeHref;
      if (link.href !== nextHref) {
        link.href = nextHref;
      }
    };
    applyHighlightTheme();

    // If system theme selected, watch for OS change to update highlight theme automatically
    let mql: MediaQueryList | undefined;
    const handleSystemChange = () => applyHighlightTheme();
    if (theme === "system") {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      // modern browsers
      mql.addEventListener?.("change", handleSystemChange);
    }
    return () => {
      mql?.removeEventListener?.("change", handleSystemChange);
    };
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      nativeAPI.invokeNativeAPI(NATIVE_API_SAVE_SETTINGS, { theme });
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
