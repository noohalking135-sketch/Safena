import { Bike, Package, MessageSquareWarning, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav({ page, setPage, t }: any) {
  const items: { id: any; label: string; icon: React.ElementType }[] = [
    { id: "home", label: t.navHome, icon: Bike },
    { id: "orders", label: t.navOrders, icon: Package },
    { id: "complaints", label: t.navComplaints, icon: MessageSquareWarning },
    { id: "account", label: t.navAccount, icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[100] border-t border-yellow-200 bg-white/95 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/95">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all",
                isActive ? "text-yellow-500 dark:text-yellow-400" : "text-slate-400 dark:text-slate-500"
              )}
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-all", isActive && "bg-yellow-100 dark:bg-yellow-900/30")}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}