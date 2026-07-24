import { ChevronLeft, Package, Heart, CreditCard, Gift, Bell, LifeBuoy, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TranslationKeys } from "@/lib/i18n";

export function AccountPage({ t, lang }: { t: TranslationKeys; lang: "ar" | "en" }) {
  const menuItems = [
    { icon: Package, label: t.account.orders, desc: t.account.ordersDesc },
    { icon: Heart, label: t.account.favorites, desc: t.account.favoritesDesc },
    { icon: CreditCard, label: t.account.payment, desc: t.account.paymentDesc },
    { icon: Gift, label: t.account.rewards, desc: t.account.rewardsDesc },
    { icon: Bell, label: t.account.notifications, desc: t.account.notificationsDesc },
    { icon: LifeBuoy, label: t.account.help, desc: t.account.helpDesc },
  ];

  return (
    <div className="min-h-full bg-slate-50 px-5 pt-14 dark:bg-slate-900">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.nav.account}</h1>
      
      <Card className="mt-4 overflow-hidden rounded-2xl border-0 bg-amber-400 shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{lang === "ar" ? "أحمد محمد" : "Ahmed M."}</h2>
            <p className="text-sm text-slate-800/80">+966 50 123 4567</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Card className="rounded-2xl border-0 shadow-sm dark:bg-slate-800">
          <CardContent className="flex flex-col items-center p-3">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">12</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t.account.statOrders}</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm dark:bg-slate-800">
          <CardContent className="flex flex-col items-center p-3">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">5</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t.account.statFavorites}</span>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-sm dark:bg-slate-800">
          <CardContent className="flex flex-col items-center p-3">
            <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">340</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{t.account.statPoints}</span>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="rounded-2xl border-0 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/50">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
                <ChevronLeft className="h-5 w-5 text-slate-400 rtl:rotate-180" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
        <LogOut className="h-4 w-4" />
        {t.account.logout}
      </button>
    </div>
  );
}
