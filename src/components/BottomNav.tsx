import { Home, ClipboardList, User, MessageSquareWarning } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/lib/i18n";

interface BottomNavProps {
  page: "home" | "orders" | "account" | "complaints";
  setPage: (page: "home" | "orders" | "account" | "complaints") => void;
  t: TranslationKeys;
}

export function BottomNav({ page, setPage, t }: BottomNavProps) {
  const items = [
    { id: "home" as const, label: t.nav.home, icon: Home },
    { id: "orders" as const, label: t.nav.orders, icon: ClipboardList },
    { id: "complaints" as const, label: t.nav.complaints, icon: MessageSquareWarning },
    { id: "account" as const, label: t.nav.account, icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 px-4 pb-4">
      <div className="mx-auto flex max-w-sm items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-lg backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-bold transition-all",
                isActive
                  ? "bg-amber-400 text-slate-900 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
