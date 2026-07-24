import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { TranslationKeys } from "@/lib/i18n";

export function OrdersPage({ t, lang }: { t: TranslationKeys; lang: "ar" | "en" }) {
  return (
    <div className="min-h-full bg-slate-50 px-5 pt-14 dark:bg-slate-900">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t.orders.title}</h1>
      
      <div className="mt-4 flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button className="border-b-2 border-amber-400 pb-2 text-sm font-bold text-amber-600">
          {t.orders.active}
        </button>
        <button className="pb-2 text-sm font-bold text-slate-400">
          {t.orders.past}
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-12 dark:border-slate-700">
        <Package className="h-12 w-12 text-slate-300 dark:text-slate-600" />
        <h3 className="mt-3 text-base font-bold text-slate-600 dark:text-slate-300">{t.orders.empty}</h3>
        <p className="mt-1 text-xs text-slate-400">{t.orders.emptyDesc}</p>
      </div>

      <Card className="mt-4 rounded-2xl border-0 shadow-md dark:bg-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">#12345</span>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              {t.orders.inProgress}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {lang === "ar" ? "برجر دبل تشيز، بيتزا مارجريتا" : "Double Cheeseburger, Margherita Pizza"}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div className="h-full w-3/4 rounded-full bg-amber-400"></div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {lang === "ar" ? "الوصول المتوقع: 15 دقيقة" : "ETA: 15 mins"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}