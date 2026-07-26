import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageToggle({ lang, setLang }: any) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="rounded-full bg-white px-3 shadow-sm dark:bg-slate-800"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-bold">{lang === "ar" ? "EN" : "ع"}</span>
    </Button>
  );
}