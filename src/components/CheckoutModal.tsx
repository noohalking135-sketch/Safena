import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID, ORDERS_TABLE_ID } from "@/lib/appwrite";
import { cn } from "@/lib/utils";
import { Send, X } from "lucide-react";

export function CheckoutModal({ t, lang, user, addresses, onClose, onConfirm, cartItems, cartTotal }: any) {
  const [selectedLocation, setSelectedLocation] = useState(addresses?.[0]?.details || "");
  const [newLocation, setNewLocation] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    const location = isNew ? newLocation.trim() : selectedLocation;
    if (!location) return;

    setIsSubmitting(true);

    const payload = JSON.stringify({
      documentId: 'unique()',
      data: {
        customer_name: user?.name || "عميل",
        customer_phone: user?.phone || "00000000",
        total: Number(cartTotal) || 0,
        items: JSON.stringify(cartItems || []),
        location: location,
        status: "قيد التحضير"
      }
    });

    try {
      const res = await fetch(`${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/collections/${ORDERS_TABLE_ID}/documents`, {
        method: "POST",
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT_ID,
          'Content-Type': 'application/json'
        },
        body: payload,
      });

      const responseData = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("تم إرسال الطلب بنجاح!");
      } else {
        console.error("Appwrite order insert error:", responseData);
        alert("خطأ " + res.status + ": " + JSON.stringify(responseData));
      }
    } catch (error) {
      console.error("Network error submitting order:", error);
      alert("Network Error: " + JSON.stringify(error));
    } finally {
      setIsSubmitting(false);
      onConfirm(location);
    }
  };

  const isDisabled = (!isNew && !selectedLocation) || (isNew && !newLocation.trim()) || isSubmitting;

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <Card className="flex max-h-[85vh] w-full flex-col rounded-t-3xl border-yellow-200 p-0 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.sendOrder}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
          <div className="flex gap-2 rounded-full bg-yellow-50 p-1 dark:bg-slate-800">
            <button
              onClick={() => setIsNew(false)}
              className={cn("flex-1 rounded-full py-2 text-sm font-semibold transition-all", !isNew ? "bg-yellow-400 text-slate-900" : "text-slate-600 dark:text-slate-300")}
            >
              {t.savedLocations}
            </button>
            <button
              onClick={() => setIsNew(true)}
              className={cn("flex-1 rounded-full py-2 text-sm font-semibold transition-all", isNew ? "bg-yellow-400 text-slate-900" : "text-slate-600 dark:text-slate-300")}
            >
              {t.newLocation}
            </button>
          </div>

          {isNew ? (
            <div className="flex flex-col gap-2">
              <Textarea
                placeholder={t.enterNewLocation || "أدخل عنوان التوصيل الجديد..."}
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="rounded-2xl"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {addresses?.length === 0 ? (
                <p className="text-center text-sm text-slate-400">{t.noSavedAddresses || "لا توجد عناوين محفوظة"}</p>
              ) : (
                addresses.map((addr: any) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedLocation(addr.details)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-3 transition-all cursor-pointer",
                      selectedLocation === addr.details ? "border-yellow-400 bg-yellow-50/50 dark:bg-slate-800" : "border-slate-100 dark:border-slate-800"
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-slate-700">
                      📍
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{addr.label || "عنوان"}</p>
                      <p className="text-xs text-slate-500">{addr.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-slate-100 p-4 dark:border-slate-800">
          <Button
            onClick={handleConfirm}
            disabled={isDisabled}
            className="w-full rounded-full bg-yellow-400 py-3 text-slate-900 font-bold hover:bg-yellow-500"
          >
            <Send className="mx-1 h-4 w-4" />
            {isSubmitting ? "جاري الإرسال..." : t.sendOrder}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
