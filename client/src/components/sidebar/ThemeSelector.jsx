import { SunIcon, MoonIcon, DesktopIcon } from "@phosphor-icons/react";
import { useTheme } from "../ThemeProvider";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-1 bg-background rounded-xl shadow-sm">
      <button
        onClick={() => setTheme("light")}
        className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all cursor-pointer ${
          theme === "light"
            ? "bg-card shadow-sm text-amber-500"
            : "text-muted hover:text-foreground"
        }`}
        title="Light Mode"
      >
        <SunIcon weight="duotone" className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all mx-1 cursor-pointer ${
          theme === "system"
            ? "bg-card shadow-sm text-foreground"
            : "text-muted hover:text-foreground"
        }`}
        title="System Theme"
      >
        <DesktopIcon weight="duotone" className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all cursor-pointer ${
          theme === "dark"
            ? "bg-card shadow-sm text-blue-400"
            : "text-muted hover:text-foreground"
        }`}
        title="Dark Mode"
      >
        <MoonIcon weight="duotone" className="w-4 h-4" />
      </button>
    </div>
  );
}
