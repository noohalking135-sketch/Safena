import { useState } from "react";
import { CheckCircle2, Home, Briefcase, Navigation, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { databases, APPWRITE_DATABASE_ID, ORDERS_TABLE_ID } from "@/lib/appwrite";
import { ID } from "appwrite";
import { cn } from "@/lib/utils";

export function CheckoutModal({ t, lang, user, addresses, onClose, onConfirm, cartItems, cartTotal }: any) {
const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
const [newLocation, setNewLocation] = useState("");
const [isNew, setIsNew] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleConfirm = async () => {
const location = isNew ? newLocation.trim() : selectedLocation;
if (!location) return;

setIsSubmitting(true);

// تجهيز الأصناف كنص واضح
const formattedItems = (cartItems || []).map((item: any) => {
const nameVal = typeof item.name === 'object' ? (item.name?.ar || item.name?.en || '') : (item.name || item.title || '');
const qty = item.qty || item.quantity || 1;
return `${nameVal} (x${qty})`;
}).filter(Boolean).join(' / ');

try {
// استخدام مكتبة Appwrite الرسمية لإرسال المستند مع كافة الحقول الإلزامية
await databases.createDocument(
APPWRITE_DATABASE_ID,
ORDERS_TABLE_ID,
ID.unique(),
{
customer_name: user?.name || "عميل",
customer_phone: user?.phone || "00000000",
total: Number(cartTotal) || 0,
items: formattedItems,
location: location || "الموقع",
status: "preparing"
}
);

setIsSubmitting(false);
onConfirm(location);
} catch (error: any) {
console.error("Appwrite order insert error:", error);
alert("خطأ أثناء إرسال الطلب: " + (error.message || JSON.stringify(error)));
setIsSubmitting(false);
}
};

const isDisabled = (!isNew && !selectedLocation) || (isNew && !newLocation.trim()) || isSubmitting;

return (
<div className="absolute inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm">
<Card className="flex max-h-[85vh] w-full flex-col rounded-t-3xl border-yellow-200 p-0 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
<CardHeader className="flex flex-row items-center justify-between p-4">
<Button
onClick={handleConfirm}
disabled={isDisabled}
className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm transition-transform hover:scale-105 hover:bg-yellow-500 disabled:opacity-50 disabled:hover:scale-100"
>
<Send className="mx-1 h-4 w-4" />
{t.sendOrder}
</Button>
<CardTitle className="text-lg font-bold text-slate-800 dark:text-white">{t.selectLocation}</CardTitle>
<Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
<X className="h-5 w-5" />
</Button>
</CardHeader>

<CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
<div className="flex gap-2 rounded-full bg-yellow-50 p-1 dark:bg-slate-700">
<button
className={cn("flex-1 rounded-full py-2 text-sm font-semibold transition-all", !isNew ? "bg-yellow-400 text-slate-800" : "text-slate-500")}
onClick={() => setIsNew(false)}
>
{t.savedLocations}
</button>
<button
className={cn("flex-1 rounded-full py-2 text-sm font-semibold transition-all", isNew ? "bg-yellow-400 text-slate-800" : "text-slate-500")}
onClick={() => setIsNew(true)}
>
{t.newLocation}
</button>
</div>

{!isNew ? (
<div className="flex flex-col gap-2">
{addresses.length === 0 ? (
<p className="text-center text-sm text-slate-400">{t.noAddresses}</p>
) : (
addresses.map((addr: any) => (
<button
key={addr.id}
onClick={() => setSelectedLocation(addr.details)}
className={cn(
"flex items-center gap-3 rounded-xl border-2 p-3 text-start transition-all",
selectedLocation === addr.details ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" : "border-transparent bg-white dark:bg-slate-700"
)}
>
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-slate-600">
{addr.label.includes(t.home) || addr.label.toLowerCase().includes("home") ? <Home className="h-5 w-5 text-yellow-600" /> : <Briefcase className="h-5 w-5 text-yellow-600" />}
</div>
<div>
<h3 className="font-bold text-slate-800 dark:text-white">{addr.label}</h3>
<p className="text-xs text-slate-500 dark:text-slate-400">{addr.details}</p>
</div>
{selectedLocation === addr.details && <CheckCircle2 className="ms-auto h-5 w-5 text-yellow-500" />}
</button>
))
)}
</div>
) : (
<div className="flex flex-col gap-2">
<Textarea
value={newLocation}
onChange={(e) => setNewLocation(e.target.value)}
placeholder={t.addressDetails}
rows={4}
className="rounded-xl dark:border-slate-600 dark:bg-slate-700"
/>
<Button variant="outline" className="flex items-center justify-center gap-2 rounded-xl border-yellow-200 text-yellow-600">
<Navigation className="h-4 w-4" /> تحديد على الخريطة
</Button>
</div>
)}
</CardContent>

<CardFooter className="sticky bottom-0 z-[999] border-t border-yellow-100 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
<Button
onClick={handleConfirm}
disabled={isDisabled}
className="w-full rounded-full bg-yellow-400 py-6 text-base font-bold text-slate-800 shadow-md transition-transform hover:scale-[1.02] hover:bg-yellow-500 disabled:opacity-50 disabled:hover:scale-100"
>
<Send className="mx-2 h-5 w-5" />
{t.confirmAndSend}
</Button>
</CardFooter>
</Card>
</div>
);
}

src/components/OrderDetails.tsx
import { MapPin, Clock, User, Phone, Package, UtensilsCrossed, CheckCircle2, Bike } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { OrderMap } from "@/components/OrderMap";

export function OrderDetails({ order, t }: { order: any; t: any }) {
// قراءة الحالة القادمة من عمود status في Appwrite (سواء كانت بالعربية أو الإنجليزية)
const rawStatus = order.status ? order.status.trim() : "قيد التحضير";

// خريطة لتحديد الألوان والأيقونات بناءً على القيمة المخزنة في قاعدة البيانات
const getStatusConfig = (status: string) => {
if (status === "في الطريق" || status === "delivering" || status === "on_way") {
return { label: t?.statusOnWay || "في الطريق", color: "bg-blue-100 text-blue-700", icon: Bike };
}
if (status === "تم التوصيل" || status === "completed" || status === "delivered") {
return { label: t?.statusDelivered || "تم التوصيل", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 };
}
// الحالة الافتراضية: قيد التحضير
return { label: t?.statusPreparing || "قيد التحضير", color: "bg-amber-100 text-amber-700", icon: UtensilsCrossed };
};

const config = getStatusConfig(rawStatus);
const StatusIcon = config.icon;

// تحديد المراحل المكتملة بناءً على الحالة الحقيقية من Appwrite
const isDelivered = rawStatus === "تم التوصيل" || rawStatus === "completed" || rawStatus === "delivered";
const isOnWay = rawStatus === "في الطريق" || rawStatus === "delivering" || rawStatus === "on_way" || isDelivered;

return (
<div className="p-5" dir="rtl">
{/* Order header */}
<div className="flex items-center justify-between">
<div>
<p className="text-xs text-slate-400">رقم الطلب</p>
<h3 className="text-xl font-bold text-slate-900 dark:text-white">#{order.id ? order.id.slice(-4) : 'جديد'}</h3>

{config.color} border-0 px-3 py-1 font-medium`}>
<StatusIcon className="ms-1 h-3.5 w-3.5" />
{config.label}
</Badge>
</div>

{/* Map */}
<div className="mt-4 h-48 overflow-hidden rounded-xl">
<OrderMap />
</div>

{/* Timeline (المراحل الحقيقية بناءً على Appwrite) */}
<div className="mt-5">
<h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">مراحل الطلب</h4>
<div className="space-y-1">
{[
{ label: "تم استلام الطلب", done: true },
{ label: "قيد التحضير", done: true },
{ label: "السائق في الطريق", done: isOnWay },
{ label: "تم التوصيل", done: isDelivered },
 ].map((step, i, arr) => (
<div key={i} className="flex items-start gap-3">
<div className="flex flex-col items-center">
<div className={flex h-7 w-7 items-center justify-center rounded-full ${step.done ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}}&gt; &lt;CheckCircle2 className={h-4 w-4 ${step.done ? "text-white" : "text-slate-400"}} />
</div>
{i < arr.length - 1 && (
<div className={mt-1 h-6 w-0.5 ${step.done ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}} /&gt; )} &lt;/div&gt; &lt;div className="pt-0.5"&gt; &lt;p className={text-sm font-medium ${step.done ? "text-slate-900 dark:text-white" : "text-slate-400"}}>{step.label}</p>
</div>
</div>
))}
</div>
</div>

<Separator className="my-5" />

{/* Customer info */}
<div>
<h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">معلومات العميل</h4>
<div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
<Avatar className="h-10 w-10">
<AvatarFallback className="bg-yellow-100 text-xs font-bold text-yellow-700">
{order.customer ? order.customer.split(" ").map((n: string) => n[0]).join("") : "زب"}
</AvatarFallback>
</Avatar>
<div className="flex-1">
<p className="text-sm font-bold text-slate-900 dark:text-white">{order.customer || "العميل"}</p>
<p className="text-xs text-slate-500 dark:text-slate-400" dir="ltr">{order.phone}</p>
</div>
{order.phone && (
<a href={tel:${order.phone}`}>
<Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-200 dark:border-slate-700">
<Phone className="h-4 w-4 text-slate-600 dark:text-slate-300" />
</Button>
</a>
)}
</div>
</div>

{/* Delivery address */}
<div className="mt-4">
<h4 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">عنوان التوصيل</h4>
<div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
<p className="text-sm text-slate-600 dark:text-slate-300">{order.address || order.homeAddress || "العنوان بالتفصيل"}</p>
</div>
</div>

<Separator className="my-5" />

{/* Order items / Total */}
<div>
<h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">تفاصيل الفاتورة</h4>
<div className="space-y-2">
<div className="flex items-center justify-between">
<span className="text-base font-bold text-slate-900 dark:text-white">الإجمالي</span>
<span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{order.total || 0} {t?.currency || "ل.س"}</span>
</div>
</div>
</div>

{/* Action buttons */}
<div className="mt-5 flex gap-2">
<a href={https://wa.me/963959213962} target="_blank" rel="noopener noreferrer" className="flex-1">
<Button className="w-full rounded-xl bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-bold">
تواصل معنا بخصوص الطلب
</Button>
</a>
</div>
</div>
);
}

telegram-bot/index.js
const fetch = require('node-fetch');

module.exports = async ({ req, res, log, error }) => {
if (req.headers['x-appwrite-event']) {
try {
const payload = JSON.parse(req.payload || '{}');

// جلب البيانات سواء كانت من الحدث مباشرة أو عبر جلب آخر وثيقة
let data = payload.document || payload;

if (!data.customer_name && !data.customer && !data.customer_phone) {
const eventHeader = req.headers['x-appwrite-event'] || '';
const collectionId = eventHeader.includes('orders') ? 'orders' : 'complaints';

const response = await fetch(https://cloud.appwrite.io/v1/databases/main_db/collections/${collectionId}/documents?_limit=1&_orderType[0]=DESC`, {
headers: {
'X-Appwrite-Project': '66b7cfcd0022421dfc6e',
'Content-Type': 'application/json'
}
});

const result = await response.json();
if (result.documents && result.documents.length > 0) {
data = result.documents[0];
}
}

// دعم كافة أسماء الحقول المحتملة لتجنب أي خطأ مستقبلاً
const customerName = data.customer_name || data.customer || data.name || "عميل جديد";
const customerPhone = data.customer_phone || data.phone || data.mobile || "غير محدد";
const location = data.location || data.address || data.homeAddress || "غير محدد";
const items = data.items || data.details || data.subject || "غير محدد";
const total = data.total ? 💰 *المجموع:* ${data.total}` : "";

const message = 🚨 *طلب أو شكوى جديدة!*\n\n +
👤 *العميل:*${customerName}\n+📞 الهاتف:latex
{customerPhone}\n` + `📍 *الموقع:* 

{location}\n+📦 التفاصيل:latex
{items}\n` + (total ? `

{total}\n` : "");

const BOT_TOKEN = '8848039805:AAEPnf84p9p0jJ7F0B6mttiW6u6ipCffq6I';
const CHAT_ID = '1671413336';

await fetch(https://api.telegram.org/bot${BOT_TOKEN}/sendMessage, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
chat_id: CHAT_ID,
text: message,
parse_mode: 'Markdown'
})
});

return res.json({ success: true });
} catch (err) {
error("Error: " + err.message);
return res.json({ success: false, error: err.message }, 500);
}
}

return res.json({ success: true });
};

telegram-bot/package.json
{
"name": "telegram-bot-function",
"version": "1.0.0",
"main": "index.js",
"dependencies": {
"node-fetch": "^2.6.7"
}
}
