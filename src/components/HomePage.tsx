import { useState } from "react";
import { Search, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockCategories, mockProducts } from "@/lib/data";
import { CustomOrderForm } from "@/components/CustomOrderForm";

export function HomePage({ t, lang, cart, setCart, onCheckout, onAddToCart }: any) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  const addToCart = (id: number) => setCart({ ...cart, [id]: (cart[id] || 0) + 1 });
  const removeFromCart = (id: number) => {
    const newCart = { ...cart };
    if (newCart[id] > 1) newCart[id]--;
    else delete newCart[id];
    setCart(newCart);
  };

  const handleAddCustom = (item: any) => {
    setCart({ ...cart, [item.id]: (cart[item.id] || 0) + item.qty });
    mockProducts.push(item);
    setActiveCategory(null);
  };

  const cartCount = Object.values(cart).reduce((a: number, b: number) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum: number, [id, qty]: [string, any]) => {
    const product = mockProducts.find((p) => p.id === Number(id));
    return sum + (product ? product.price * qty : 0);
  }, 0);

  const filteredProducts = activeCategory ? mockProducts.filter(p => p.category === activeCategory) : mockProducts;

  return (
    <div className="flex flex-col gap-6 p-4 pt-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.appName} <span className="text-yellow-500">.</span></h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t.tagline}</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input placeholder={t.searchPlaceholder} className="rounded-xl border-yellow-200 bg-white py-6 pl-10 text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.categories}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === "custom") {
                  setShowCustomForm(true);
                } else {
                  setActiveCategory(activeCategory === cat.id ? null : cat.id);
                }
              }}
              className={cn(
                "flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-2xl shadow-sm transition-all",
                activeCategory === cat.id ? "bg-yellow-400 text-slate-800 scale-105" : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              )}
            >
              <cat.icon className="h-8 w-8 mb-1" />
              <span className="text-xs font-semibold">{t[cat.labelKey]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">{activeCategory ? t.categories : t.popular}</h2>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden border-none bg-white shadow-md dark:bg-slate-800">
              <CardContent className="p-0">
                <div className="relative h-32 w-full overflow-hidden">
                  <img src={product.image} alt={product.name[lang]} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">{product.name[lang]}</h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-bold text-yellow-600 dark:text-yellow-400 text-sm">{product.price} {t.currency}</span>
                    {cart[product.id] ? (
                      <div className="flex items-center gap-1">
                        {/* تم تغيير زر الناقص هنا ليصبح أحمر وواضح في الوضعين */}
                        <Button size="icon" variant="outline" className="h-7 w-7 rounded-full border-red-200 bg-red-50 p-0 text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400" onClick={() => removeFromCart(product.id)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-sm font-bold text-slate-800 dark:text-white">{cart[product.id]}</span>
                        <Button 
                          size="icon" 
                          className="h-7 w-7 rounded-full bg-yellow-400 p-0 text-slate-800 hover:bg-yellow-500" 
                          onClick={(e) => {
                            addToCart(product.id);
                            onAddToCart(product, e.currentTarget.getBoundingClientRect());
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-yellow-400 p-0 text-slate-800 hover:bg-yellow-500" 
                        onClick={(e) => {
                          addToCart(product.id);
                          onAddToCart(product, e.currentTarget.getBoundingClientRect());
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {cartCount > 0 && (
        <Card className="fixed bottom-20 left-4 right-4 z-40 border-yellow-200 bg-yellow-50 shadow-lg dark:border-yellow-800 dark:bg-yellow-900/20">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{cartCount} {t.items}</p>
              <p className="text-lg font-bold text-slate-800 dark:text-white">{cartTotal} {t.currency}</p>
            </div>
            <Button onClick={onCheckout} className="rounded-full bg-yellow-400 text-slate-800 hover:bg-yellow-500">
              {t.checkout} 
            </Button>
          </CardContent>
        </Card>
      )}

      {showCustomForm && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <CustomOrderForm t={t} lang={lang} onAdd={handleAddCustom} onClose={() => setShowCustomForm(false)} />
        </div>
      )}
    </div>
  );
}
