import './index.css';
import { useState, useEffect, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { HomePage } from "@/components/HomePage";
import { OrdersPage } from "@/components/OrdersPage";
import { ComplaintsPage } from "@/components/ComplaintsPage";
import { AccountPage } from "@/components/AccountPage";
import { BottomNav } from "@/components/BottomNav";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Onboarding } from "@/components/Onboarding";
import { CheckoutModal } from "@/components/CheckoutModal";
import { FlyingImage } from "@/components/FlyingImage";
import { SuccessModal } from "@/components/SuccessModal";
import { mockProducts } from "@/lib/data";
import { translations } from "@/lib/i18n";
import { databases, DATABASE_ID, ORDERS_COLLECTION_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { cn } from "@/lib/utils";

export type Lang = "ar" | "en";
export type Page = "home" | "orders" | "complaints" | "account";
export type Theme = "light" | "dark";

export default function App() {
const [lang, setLang] = useState<Lang>("ar");
const [theme, setTheme] = useState<Theme>("light");
const [page, setPage] = useState<Page>("home");
const [cart, setCart] = useState<Record<number, number>>({});
const [showCheckout, setShowCheckout] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [orders, setOrders] = useState<any[]>([]);
const [flyingImages, setFlyingImages] = useState<{ id: number; src: string; from: { x: number; y: number }; to?: { x: number; y: number } }[]>([]);
const cartRef = useRef<HTMLDivElement>(null);

const [user, setUser] = useState<any>(null);
const [addresses, setAddresses] = useState<any[]>([]);

const t = translations[lang];

useEffect(() => {
try {
const savedUser = localStorage.getItem("noah_user");
const savedAddresses = localStorage.getItem("noah_addresses");
const savedOrders = localStorage.getItem("noah_orders");

if (savedUser) setUser(JSON.parse(savedUser));
if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
if (savedOrders) setOrders(JSON.parse(savedOrders));

databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
Query.orderDesc("createdAt")
 ]).then((response) => {
if (response.documents && response.documents.length > 0) {
const appwriteOrders = response.documents.map((o: any) => ({
id: o.orderId || o.

createdAt ? o.$`createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
location: o.location,
timer: o.timer || 300,
}));
setOrders(prev => {
const existingIds = new Set(prev.map(o => o.id));
const newOrders = appwriteOrders.filter((o: any) => !existingIds.has(o.id));
return [...prev, ...newOrders];
});
}
}).catch((error) => {
console.error("Error fetching orders from Appwrite:", error);
});

} catch (e) {
console.error("Failed to load user data", e);
}
}, []);

useEffect(() => {
if (user) localStorage.setItem("noah_user", JSON.stringify(user));
}, [user]);

useEffect(() => {
if (addresses.length > 0) localStorage.setItem("noah_addresses", JSON.stringify(addresses));
}, [addresses]);

useEffect(() => {
if (orders.length > 0) localStorage.setItem("noah_orders", JSON.stringify(orders));
}, [orders]);

useEffect(() => {
const timer = setInterval(() => {
setOrders(prev => prev.map(order => {
if (order.status === "preparing" || order.status === "قيد التحضير") {
if (order.timer > 0) {
return { ...order, timer: order.timer - 1 };
} else {
return { ...order, status: "onWay" };
}
}
return order;
}));
}, 1000);
return () => clearInterval(timer);
}, []);

const handleOnboardingComplete = (data: { name: string; phone: string; homeAddress: string }) => {
const newUser = { name: data.name, phone: data.phone, homeAddress: data.homeAddress };
setUser(newUser);
setAddresses([{ id: Date.now(), label: t.home, details: data.homeAddress }]);
};

const handleAddToCart = (product: any, rect: DOMRect) => {
const cartElement = cartRef.current;
if (!cartElement) return;

const cartRect = cartElement.getBoundingClientRect();
const from = { x: rect.left, y: rect.top };
const to = { x: cartRect.left, y: cartRect.top };

const id = Date.now();
setFlyingImages(prev => [...prev, { id, src: product.image, from, to }]);

setTimeout(() => {
setFlyingImages(prev => prev.filter(img => img.id !== id));
}, 800);
};

const handleCheckoutConfirm = (location: string) => {
setShowCheckout(false);

const cartItems = Object.entries(cart).map(([id, qty]) => {
const product = mockProducts.find(p => p.id === Number(id))!;
return { name: product.name, qty, price: product.price };
});

const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

const orderId = ORD-${Math.floor(1000 + Math.random() * 9000)}`;
const newOrder = {
id: orderId,
status: "قيد التحضير",
total,
date: new Date().toISOString().split('T')[0],
items: cartItems,
location,
timer: 300,
};

setOrders(prev => [newOrder, ...prev]);
setCart({});
setShowSuccess(true);
setTimeout(() => {
setShowSuccess(false);
setPage("orders");
}, 2000);
};

const pageIndex = getPageIndex(page);
const directionMultiplier = lang === "ar" ? 1 : -1;
const translateXValue = pageIndex * 100 * directionMultiplier;

if (!user) {
return (
<div dir={lang === "ar" ? "rtl" : "ltr"} className={theme === 'light' ? 'bg-slate-50 text-slate-900 min-h-screen' : 'bg-slate-950 text-white min-h-screen'}>
<div className="relative mx-auto h-screen max-w-md overflow-hidden shadow-2xl shadow-yellow-300/20">
<div className="absolute end-4 top-4 z-50 flex gap-2">
<ThemeToggle theme={theme} setTheme={setTheme} />
<LanguageToggle lang={lang} setLang={setLang} />
</div>
<Onboarding t={t} onComplete={handleOnboardingComplete} />
</div>
</div>
);
}

const cartItems = Object.entries(cart).map(([id, qty]) => {
const product = mockProducts.find(p => p.id === Number(id))!;
return { name: product.name, qty, price: product.price };
});

const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

return (
<div dir={lang === "ar" ? "rtl" : "ltr"} className={theme === 'light' ? 'bg-slate-50 text-slate-900 min-h-screen' : 'bg-slate-950 text-white min-h-screen'}>
<div className="relative mx-auto h-screen max-w-md overflow-hidden shadow-2xl shadow-yellow-300/20">

<div className="absolute end-4 top-4 z-50 flex gap-2">
<ThemeToggle theme={theme} setTheme={setTheme} />
<LanguageToggle lang={lang} setLang={setLang} />
</div>

<div
className="flex h-full transition-transform duration-300 ease-out"
style={{ transform: translateX(${translateXValue}%) }}
>
<div className="h-full w-full flex-shrink-0 overflow-y-auto pb-24">
<HomePage
t={t}
lang={lang}
cart={cart}
setCart={setCart}
onCheckout={() => setShowCheckout(true)}
onAddToCart={handleAddToCart}
/>
</div>
<div className="h-full w-full flex-shrink-0 overflow-y-auto pb-24">
<OrdersPage t={t} lang={lang} orders={orders} setPage={setPage} />
</div>
<div className="h-full w-full flex-shrink-0 overflow-y-auto pb-24">
<ComplaintsPage t={t} lang={lang} user={user} />
</div>
<div className="h-full w-full flex-shrink-0 overflow-y-auto pb-24">
<AccountPage
t={t}
lang={lang}
user={user}
setUser={setUser}
addresses={addresses}
setAddresses={setAddresses}
/>
</div>
</div>

{showCheckout && (
<CheckoutModal
t={t}
lang={lang}
user={user}
addresses={addresses}
cartItems={cartItems}
cartTotal={cartTotal}
onClose={() => setShowCheckout(false)}
onConfirm={handleCheckoutConfirm}
/>
)}

{showSuccess && (
<SuccessModal t={t} />
)}

{flyingImages.map((img) => (
<FlyingImage
key={img.id}
src={img.src}
from={img.from}
to={img.to || img.from}
onComplete={() => setFlyingImages(prev => prev.filter(i => i.id !== img.id))}
/>
))}

<div ref={cartRef} className="absolute bottom-4 end-4 z-[150] hidden">
<ShoppingBag className="h-6 w-6 text-yellow-500" />
</div>

<BottomNav page={page} setPage={setPage} t={t} />
</div>
</div>
);
}

function getPageIndex(page: Page) {
const order: Page[] = ["home", "orders", "complaints", "account"];
return order.indexOf(page);
}