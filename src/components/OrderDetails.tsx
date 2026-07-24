import { MapPin, Clock, User, Phone, Package, UtensilsCrossed, CheckCircle2, Bike } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OrderMap } from "@/components/OrderMap";
import type { Order } from "@/lib/data";

export function OrderDetails({ order }: { order: Order }) {
  const statusConfig = {
    preparing: { label: "قيد التحضير", color: "bg-amber-100 text-amber-700", icon: UtensilsCrossed },
    delivering: { label: "قيد التوصيل", color: "bg-blue-100 text-blue-700", icon: Bike },
    completed: { label: "مكتمل", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  };
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;

  return (
    <div className="p-5">
      {/* Order header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">رقم الطلب</p>
          <h3 className="text-xl font-bold text-slate-900">#{order.id}</h3>
        </div>
        <Badge className={`${config.color} border-0 px-3 py-1 font-medium`}>
          <StatusIcon className="ml-1 h-3.5 w-3.5" />
          {config.label}
        </Badge>
      </div>

      {/* Map */}
      <div className="mt-4 h-48">
        <OrderMap />
      </div>

      {/* Timeline */}
      <div className="mt-5">
        <h4 className="mb-3 text-sm font-bold text-slate-700">مراحل الطلب</h4>
        <div className="space-y-1">
          {[
            { label: "تم استلام الطلب", time: "2:30 م", done: true },
            { label: "تم قبول المطعم", time: "2:32 م", done: true },
            { label: "قيد التحضير", time: "2:35 م", done: order.status !== "preparing" },
            { label: "السائق في الطريق", time: "2:50 م", done: order.status === "delivering" || order.status === "completed" },
            { label: "تم التوصيل", time: "3:05 م", done: order.status === "completed" },
          ].map((step, i, arr) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full ${step.done ? "bg-emerald-500" : "bg-slate-200"}`}>
                  <CheckCircle2 className={`h-4 w-4 ${step.done ? "text-white" : "text-slate-400"}`} />
                </div>
                {i < arr.length - 1 && (
                  <div className={`mt-1 h-6 w-0.5 ${step.done ? "bg-emerald-500" : "bg-slate-200"}`} />
                )}
              </div>
              <div className="pt-0.5">
                <p className={`text-sm font-medium ${step.done ? "text-slate-900" : "text-slate-400"}`}>{step.label}</p>
                <p className="text-xs text-slate-400">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-5" />

      {/* Customer info */}
      <div>
        <h4 className="mb-3 text-sm font-bold text-slate-700">معلومات العميل</h4>
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-orange-100 text-xs font-bold text-orange-700">
              {order.customer.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">{order.customer}</p>
            <p className="text-xs text-slate-500">{order.phone}</p>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200">
            <Phone className="h-4 w-4 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* Delivery address */}
      <div className="mt-4">
        <h4 className="mb-2 text-sm font-bold text-slate-700">عنوان التوصيل</h4>
        <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
          <p className="text-sm text-slate-600">{order.address}</p>
        </div>
      </div>

      <Separator className="my-5" />

      {/* Order items */}
      <div>
        <h4 className="mb-3 text-sm font-bold text-slate-700">تفاصiل الفاتورة</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">المجموع الفرعي</span>
            <span className="font-medium text-slate-900">{order.subtotal} ر.س</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">رسوم التوصيل</span>
            <span className="font-medium text-slate-900">{order.deliveryFee} ر.س</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">الضريبة (15%)</span>
            <span className="font-medium text-slate-900">{order.tax} ر.س</span>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-slate-900">الإجمالي</span>
            <span className="text-lg font-bold text-orange-600">{order.total} ر.س</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex gap-2">
        <Button className="flex-1 rounded-xl bg-orange-600 text-white hover:bg-orange-700">
          تواصل مع السائق
        </Button>
        <Button variant="outline" className="rounded-xl border-slate-200 px-4">
          <Package className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
