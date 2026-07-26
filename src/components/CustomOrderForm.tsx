import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CustomOrderForm({ t, lang, onAdd, onClose }: any) {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now(),
      name: { [lang]: name },
      price: Number(price) || 0,
      qty,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
      isCustom: true,
    });
    onClose();
  };

  return (
    <Card className="border-yellow-200 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">{t.customOrderTitle}</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">{t.customOrderDesc}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.customOrderName}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.customOrderDetails}</label>
            <Textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={3} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.customOrderPrice}</label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <div className="flex w-24 flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.customOrderQty}</label>
              <Input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} required className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
            </div>
          </div>
          <Button type="submit" className="mt-2 rounded-full bg-yellow-400 text-slate-800 hover:bg-yellow-500">
            {t.addCustomToCart}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}