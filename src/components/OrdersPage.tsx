import { Package, Bike, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function OrdersPage({ t, lang, orders, setPage }: any) {
  const statusColors: Record<string, string> = {
    onWay: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    preparing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.orders}</h1>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Package className="h-16 w-16 text-yellow-400 dark:text-yellow-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.emptyOrders}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t.emptyOrdersDesc}</p>
          </div>
          <Button onClick={() => setPage("home")} className="rounded-full bg-yellow-400 text-slate-900 hover:bg-yellow-500">
            {t.startOrder}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order: any) => (
            <Card key={order.id} className="border-yellow-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <div>
                  <CardTitle className="text-base text-slate-900 dark:text-white">{t.orderNumber} {order.id.split("-")[1]}</CardTitle>
                  <CardDescription className="text-xs text-slate-600 dark:text-slate-400">{order.date}</CardDescription>
                </div>
                <Badge className={cn("font-semibold", statusColors[order.status])}>
                  {t[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}` as keyof typeof t] as string}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  {order.items.map((item: any, idx: number) => (
                    <Badge key={idx} variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      {item.qty}x {item.name[lang]}
                    </Badge>
                  ))}
                </div>
                
                {order.status === "preparing" && (
                  <div className="mb-3 rounded-xl bg-yellow-100/50 p-3 text-center dark:bg-yellow-900/20">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{t.arrivalTime}</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {Math.floor(order.timer / 60)}:{(order.timer % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                )}

                {order.status === "onWay" && (
                  <div className="mb-3 flex items-center gap-3 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200/50 dark:bg-blue-900/40">
                      <Bike className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{t.captainName}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white" dir="ltr">+963959213692</p>
                    </div>
                    <a href="tel:+963959213692">
                      <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                  <span>{order.items.length} {t.items}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{order.total} {t.currency}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
