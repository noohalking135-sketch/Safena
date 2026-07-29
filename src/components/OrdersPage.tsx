import { Package, Bike, Phone, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
       
export function OrdersPage({ t, lang, orders, setPage, onSelectOrder }: any) {
  const getStatusInfo = (rawStatus: string) => {
    const status = rawStatus ? rawStatus.trim().toLowerCase() : "preparing";
    
    if (status === "onway" || status === "on_way" || status === "delivering" || status === "في الطريق") {
      return {
        label: t.statusOnWay || "السائق في طريقه إليك",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      };
    }
    if (status === "delivered" || status === "completed" || status === "تم التوصيل") {
      return {
        label: t.statusDelivered || "تم التوصيل",
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      };
    }
    if (status === "cancelled" || status === "ملغي") {
      return {
        label: t.statusCancelled || "ملغي",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      };
    }
    return {
      label: t.statusPreparing || "قيد التحضير",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
    };
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-12" dir="rtl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.orders}</h1>
      
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Package className="h-16 w-16 text-yellow-400 dark:text-yellow-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.emptyOrders}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.emptyOrdersDesc}</p>
          </div>
          <Button onClick={() => setPage("home")} className="rounded-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold">
            {t.startOrder}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order: any) => {
            const statusInfo = getStatusInfo(order.status);
            const fullId = order.$id || order.id || "";
            const numericOnly = fullId.replace(/\D/g, ""); 
            const orderId = numericOnly.length >= 3 ? numericOnly.slice(-4) : Math.abs(fullId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)).toString().slice(-4);

            return (
              <Card 
                key={order.$id || order.id} 
                onClick={() => onSelectOrder && onSelectOrder(order)}
                className="border-yellow-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 cursor-pointer hover:border-yellow-400 transition-all"
              >
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <div>
                    <CardTitle className="text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{t.orderNumber} #{orderId}</span>
                      <ChevronLeft className="h-4 w-4 text-slate-400" />
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                      {order.date || new Date(order.$createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={cn("font-semibold border-0", statusInfo.color)}>
                    {statusInfo.label}
                  </Badge>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {order.items && typeof order.items === 'string' ? (
                      <span className="text-xs text-slate-600 dark:text-slate-300">تفاصيل الأصناف مسجلة</span>
                    ) : (
                      order.items?.map((item: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          {item.qty}x {item.name?.[lang] || item.name}
                        </Badge>
                      ))
                    )}
                  </div>
                  
                  {(() => {
                    const st = (order.status || "").trim().toLowerCase();
                    return (st === "onway" || st === "on_way" || st === "delivering" || st === "في الطريق");
                  })() && (
                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20" onClick={(e) => e.stopPropagation()}>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200/50 dark:bg-blue-900/40">
                        <Bike className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{t.captainName || "السائق"}</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white" dir="ltr">+963 959 213 962</p>
                      </div>
                      <a href="tel:+963959213962">
                        <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  )}

                  {(() => {
                    const st = (order.status || "").trim().toLowerCase();
                    return (st === "delivered" || st === "completed" || st === "تم التوصيل");
                  })() && (
                    <div className="mb-3 flex items-center justify-between rounded-xl bg-green-50 p-3 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs font-medium">
                      <span>الطلب انتهى وسيختفي خلال:</span>
                      <span className="font-bold font-mono text-sm">
                        {Math.floor((order.deliveredTimer ?? 300) / 60)}:{((order.deliveredTimer ?? 300) % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                    <span>{order.items?.length || 1} {t.items || "أصناف"}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{order.total} {t.currency}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
