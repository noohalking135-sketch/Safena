import { useState } from "react";
import { Search, Star, Clock, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { categories, products } from "@/lib/data";
import type { TranslationKeys } from "@/lib/i18n";

export function HomePage({ t, lang }: { t: TranslationKeys; lang: "ar" | "en" }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory ? p.id.startsWith(selectedCategory.charAt(0)) : true;
    const matchesSearch = p.name[lang].toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900">
      <div className="bg-amber-400 px-5 pb-8 pt-14">
        <h1 className="text-3xl font-extrabold text-slate-900">
          {lang === "ar" ? "توصيل" : "Delivery"}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-800/80">
          {lang === "ar" ? "كل ما تحتاجه، بسرعة إلى بابك" : "Everything you need, fast to your door"}
        </p>
        
        <div className="relative mt-5">
          <Search className="absolute top-3.5 start-3 h-5 w-5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.home.searchPlaceholder}
            className="rounded-2xl border-0 bg-white py-6 ps-11 shadow-lg dark:bg-slate-800"
          />
        </div>
      </div>

      <div className="px-5 pt-6">
        {selectedCategory ? (
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 flex items-center gap-1 text-sm font-bold text-amber-600 hover:underline"
          >
            <ChevronRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
            {t.home.backToCategories}
          </button>
        ) : (
          <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">{t.home.categories}</h2>
        )}

        {!selectedCategory && (
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center gap-2"
              >
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl shadow-sm ${cat.color}`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {cat.name[lang]}
                </span>
              </button>
            ))}
          </div>
        )}

        {selectedCategory && (
          <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
            {categories.find((c) => c.id === selectedCategory)?.name[lang]}
          </h2>
        )}

        {!selectedCategory && (
          <div className="mt-6 mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.home.popular}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.home.popularDesc}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden rounded-2xl border-0 shadow-md">
              <div className="relative h-32 w-full overflow-hidden">
                <img src={product.image} alt={product.name[lang]} className="h-full w-full object-cover" />
                <div className="absolute top-2 end-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-slate-900 backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {product.rating}
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {product.name[lang]}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                  {product.desc[lang]}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-extrabold text-amber-600 dark:text-amber-400">
                    {product.price} {lang === "ar" ? "ر.س" : "SAR"}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {product.time} {t.home.mins}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
