import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  lang: "ar" | "en";
  setLang: (lang: "ar" | "en") => void;
}

export function LanguageToggle({ lang, setLang }: LanguageToggleProps) {
  return (
    <button
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm hover:bg-white dark:bg-slate-800/90 dark:text-white dark:hover:bg-slate-800"
    >
      <Languages className="h-4 w-4" />
      {lang === "ar" ? "EN" : "ع"}
    </button>
  );
}