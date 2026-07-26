import { useState, useEffect, useRef } from "react";
import { Bike, Package, MessageSquareWarning, User, Languages, Search, Plus, Minus, CheckCircle2, ArrowRight, Moon, Sun, Home, Briefcase, Navigation, X, ChefHat, Phone, Pencil, Trash2, Shirt, Pizza, Coffee, Smartphone, Dumbbell, PencilLine, ShoppingBag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// --- Supabase Client Initialization ---
// @ts-ignore
const supabase = window.supabase ? window.supabase.createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
) : null;

// --- i18n Translations ---
const translations = {
  ar: {
    appName: "سفينة نوح لتوصيل الطلبات",
    tagline: "أسرع توصيلة في مدينتك",
    searchPlaceholder: "ابحث عن مطعم أو طبق...",
    categories: "التصنيفات",
    popular: "الأكثر طلباً",
    addToCart: "أضف للسلة",
    cart: "السلة",
    cartEmpty: "سلتك فارغة",
    cartEmptyDesc: "أضف بعض الأطباق اللذيذة لتبدأ طلبك",
    checkout: "إتمام الطلب",
    deliveryFee: "رسوم التوصيل",
    total: "الإجمالي",
    orders: "طلباتي",
    activeOrders: "طلبات نشطة",
    pastOrders: "طلبات سابقة",
    complaints: "الشكاوى",
    account: "حسابي",
    submitComplaint: "إرسال الشكوى",
    complaintSubject: "موضوع الشكوى",
    complaintDetails: "تفاصيل الشكوى",
    complaintSubmitted: "تم إرسال شكواك بنجاح، سنتواصل معك قريباً",
    navHome: "الرئيسية",
    navOrders: "طلباتي",
    navComplaints: "شكاوى",
    navAccount: "حسابي",
    minutes: "دقيقة",
    currency: "ل.س",
    statusPreparing: "قيد التحضير",
    statusOnWay: "في الطريق",
    statusDelivered: "تم التوصيل",
    statusCancelled: "ملغي",
    orderNumber: "رقم الطلب",
    reOrder: "إعادة الطلب",
    freeDelivery: "توصيل مجاني",
    rating: "تقييم",
    welcomeBack: "مرحباً بعودتك",
    userName: "أحمد العتيبي",
    editProfile: "تعديل الملف الشخصي",
    addresses: "العناوين المحفوظة",
    paymentMethods: "وسائل الدفع",
    helpCenter: "تواصل معنا",
    logout: "تسجيل الخروج",
    home: "المنزل",
    work: "العمل",
    items: "أصناف",
    darkMode: "الوضع الليلي",
    lightMode: "الوضع النهاري",
    whatsappSupport: "تواصل عبر واتساب",
    whatsappNumber: "0959213962",
    addAddress: "إضافة عنوان جديد",
    editAddress: "تعديل العنوان",
    addressLabel: "اسم العنوان (مثل: المنزل، العمل)",
    addressDetails: "تفاصيل العنوان",
    save: "حفظ",
    cancel: "إلغاء",
    noAddresses: "لا توجد عناوين محفوظة بعد",
    editProfileTitle: "تعديل الملف الشخصي",
    fullName: "الاسم الكامل",
    phoneNumber: "رقم الهاتف",
    homeAddress: "عنوان المنزل",
    profileUpdated: "تم تحديث الملف الشخصي بنجاح",
    selectLocation: "تحديد موقع التوصيل",
    savedLocations: "العناوين المحفوظة",
    newLocation: "موقع جديد",
    confirmLocation: "تأكيد الموقع",
    sendOrder: "إرسال الطلب",
    confirmAndSend: "تأكيد وإرسال الطلب",
    orderPreparing: "طلبك قيد التحضير",
    orderPreparingDesc: "تم استلام طلبك وسيتم تحضيره الآن",
    trackOrder: "تتبع الطلب",
    captainAssigned: "تم تعيين الكابتن",
    captainName: "الكابتن محمد",
    captainPhone: "اتصل بالكابتن",
    arrivalTime: "الوقت المتوقع للوصول",
    orderItems: "محتويات الطلب",
    emptyOrders: "لا توجد طلبات بعد",
    emptyOrdersDesc: "تصفح المطاعم وابدأ طلبك الأول",
    startOrder: "ابدأ الطلب الآن",
    deleteAddressConfirm: "هل أنت متأكد من حذف هذا العنوان؟",
    catFood: "أطعمة",
    catClothes: "ملابس",
    catDrinks: "مشروبات",
    catElectronics: "إلكترونيات",
    catSports: "رياضة",
    catCustom: "طلب يدوي",
    customOrderTitle: "كتابة طلب يدوي",
    customOrderDesc: "لم تجد ما تبحث عنه؟ اكتب طلبك وسنتكفل بإيجاده وتوصيله",
    customOrderName: "اسم المنتج أو الطبق",
    customOrderDetails: "التفاصيل والوصف",
    customOrderPrice: "السعر المتوقع (اختياري)",
    customOrderQty: "الكمية",
    addCustomToCart: "إضافة الطلب للسلة",
    customOrderAdded: "تمت إضافة طلبك للسلة",
    submitting: "جاري الإرسال...",
    welcomeTitle: "أهلاً بك في سفينة نوح",
    welcomeDesc: "يرجى إدخال بياناتك للمتابعة",
    startUsing: "ابدأ التوصيل",
    welcomeNamePlaceholder: "الاسم الكامل",
    welcomePhonePlaceholder: "رقم الهاتف",
    welcomeAddressPlaceholder: "العنوان بالتفصيل",
    phoneError: "يجب أن يبدأ الرقم بـ 09 ويتكون من 10 أرقام",
  },
  en: {
    appName: "Noah's Ark Delivery",
    tagline: "Fastest delivery in your city",
    searchPlaceholder: "Search for restaurant or dish...",
    categories: "Categories",
    popular: "Most Popular",
    restaurants: "Featured Restaurants",
    addToCart: "Add to Cart",
    cart: "Cart",
    cartEmpty: "Your cart is empty",
    cartEmptyDesc: "Add some delicious dishes to start your order",
    checkout: "Checkout",
    deliveryFee: "Delivery Fee",
    total: "Total",
    orders: "My Orders",
    activeOrders: "Active Orders",
    pastOrders: "Past Orders",
    complaints: "Complaints",
    account: "Account",
    submitComplaint: "Submit Complaint",
    complaintSubject: "Subject",
    complaintDetails: "Details",
    complaintSubmitted: "Your complaint has been submitted successfully, we will contact you soon",
    navHome: "Home",
    navOrders: "Orders",
    navComplaints: "Complaints",
    navAccount: "Account",
    minutes: "min",
    currency: "SYP",
    statusPreparing: "Preparing",
    statusOnWay: "On the way",
    statusDelivered: "Delivered",
    statusCancelled: "Cancelled",
    orderNumber: "Order #",
    reOrder: "Reorder",
    freeDelivery: "Free Delivery",
    rating: "Rating",
    welcomeBack: "Welcome back",
    userName: "Ahmed Al-Otaibi",
    editProfile: "Edit Profile",
    addresses: "Saved Addresses",
    paymentMethods: "Payment Methods",
    helpCenter: "Contact Us",
    logout: "Logout",
    home: "Home",
    work: "Work",
    items: "items",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    whatsappSupport: "Contact via WhatsApp",
    whatsappNumber: "0959213962",
    addAddress: "Add New Address",
    editAddress: "Edit Address",
    addressLabel: "Address Label (e.g., Home, Work)",
    addressDetails: "Address Details",
    save: "Save",
    cancel: "Cancel",
    noAddresses: "No saved addresses yet",
    editProfileTitle: "Edit Profile",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    homeAddress: "Home Address",
    profileUpdated: "Profile updated successfully",
    selectLocation: "Select Delivery Location",
    savedLocations: "Saved Locations",
    newLocation: "New Location",
    confirmLocation: "Confirm Location",
    sendOrder: "Send Order",
    confirmAndSend: "Confirm and Send Order",
    orderPreparing: "Your order is being prepared",
    orderPreparingDesc: "Your order has been received and is being prepared",
    trackOrder: "Track Order",
    captainAssigned: "Captain Assigned",
    captainName: "Captain Mohammed",
    captainPhone: "Call Captain",
    arrivalTime: "Estimated Arrival",
    orderItems: "Order Items",
    emptyOrders: "No orders yet",
    emptyOrdersDesc: "Browse restaurants and start your first order",
    startOrder: "Start Ordering",
    deleteAddressConfirm: "Are you sure you want to delete this address?",
    catFood: "Food",
    catClothes: "Clothes",
    catDrinks: "Drinks",
    catElectronics: "Electronics",
    catSports: "Sports",
    catCustom: "Custom Order",
    customOrderTitle: "Write Custom Order",
    customOrderDesc: "Didn't find what you're looking for? Write your order and we'll get it delivered",
    customOrderName: "Product or Dish Name",
    customOrderDetails: "Details and Description",
    customOrderPrice: "Expected Price (Optional)",
    customOrderQty: "Quantity",
    addCustomToCart: "Add to Cart",
    customOrderAdded: "Your order has been added to cart",
    submitting: "Submitting...",
    welcomeTitle: "Welcome to Noah's Ark",
    welcomeDesc: "Please enter your details to continue",
    startUsing: "Start Delivery",
    welcomeNamePlaceholder: "Full Name",
    welcomePhonePlaceholder: "Phone Number",
    welcomeAddressPlaceholder: "Detailed Address",
    phoneError: "Phone must start with 09 and be exactly 10 digits",
  },
};

type Lang = "ar" | "en";
type Page = "home" | "orders" | "complaints" | "account";
type Translation = typeof translations["ar"];

// --- Mock Data with Real Image URLs ---
const mockCategories = [
  { id: "food", icon: Pizza, labelKey: "catFood" as const },
  { id: "clothes", icon: Shirt, labelKey: "catClothes" as const },
  { id: "drinks", icon: Coffee, labelKey: "catDrinks" as const },
  { id: "electronics", icon: Smartphone, labelKey: "catElectronics" as const },
  { id: "sports", icon: Dumbbell, labelKey: "catSports" as const },
  { id: "custom", icon: PencilLine, labelKey: "catCustom" as const },
];

const mockProducts = [
  { id: 1, category: "food", name: { ar: "تشيز برجر", en: "Cheese Burger" }, price: 35, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 2, category: "food", name: { ar: "بيبروني بيتزا", en: "Pepperoni Pizza" }, price: 45, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { id: 3, category: "food", name: { ar: "كنتاكي وجبة", en: "Chicken Meal" }, price: 30, image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&q=80" },
  { id: 4, category: "food", name: { ar: "سلطة سيزر", en: "Caesar Salad" }, price: 25, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80" },
  { id: 5, category: "clothes", name: { ar: "تيشيرت قطن", en: "Cotton T-Shirt" }, price: 50, image: "https://images.unsplash.com/photo-1521572163474-6564e9c4ee99?w=400&q=80" },
  { id: 6, category: "clothes", name: { ar: "بنطال جينز", en: "Jeans" }, price: 80, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80" },
  { id: 7, category: "clothes", name: { ar: "حذاء رياضي", en: "Sneakers" }, price: 120, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { id: 8, category: "clothes", name: { ar: "جاكيت شتوي", en: "Winter Jacket" }, price: 150, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80" },
  { id: 9, category: "drinks", name: { ar: "آيس كوفي", en: "Iced Coffee" }, price: 15, image: "https://images.unsplash.com/photo-1461023058943-073be3382d5f?w=400&q=80" },
  { id: 10, category: "drinks", name: { ar: "عصير برتقال", en: "Orange Juice" }, price: 20, image: "https://images.unsplash.com/photo-1600271886736-36f77b5b85e1?w=400&q=80" },
  { id: 11, category: "drinks", name: { ar: "موكا ساخن", en: "Hot Mocha" }, price: 18, image: "https://images.unsplash.com/photo-1572442388184-a8c0158ff5f9?w=400&q=80" },
  { id: 12, category: "drinks", name: { ar: "ماء معدني", en: "Mineral Water" }, price: 5, image: "https://images.unsplash.com/photo-1560847468-5eef0e98839b?w=400&q=80" },
  { id: 13, category: "electronics", name: { ar: "سماعات بلوتوث", en: "Bluetooth Headphones" }, price: 200, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
  { id: 14, category: "electronics", name: { ar: "شاحن سريع", en: "Fast Charger" }, price: 35, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80" },
  { id: 15, category: "electronics", name: { ar: "ساعة ذكية", en: "Smart Watch" }, price: 300, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80" },
  { id: 16, category: "electronics", name: { ar: "ماوس لاسلكي", en: "Wireless Mouse" }, price: 45, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80" },
  { id: 17, category: "sports", name: { ar: "كرة قدم", en: "Soccer Ball" }, price: 60, image: "https://images.unsplash.com/photo-1614632537190-23e4146777db?w=400&q=80" },
  { id: 18, category: "sports", name: { ar: "دمبل حديد", en: "Dumbbell" }, price: 90, image: "https://images.unsplash.com/photo-1583454113551-9f392e119c58?w=400&q=80" },
  { id: 19, category: "sports", name: { ar: "حبل قفز", en: "Jump Rope" }, price: 15, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&q=80" },
  { id: 20, category: "sports", name: { ar: "زجاجة ماء", en: "Water Bottle" }, price: 10, image: "https://images.unsplash.com/photo-1603002609090-772b67b2da78?w=400&q=80" },
];

// --- Components ---

function LanguageToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="rounded-full bg-white px-3 shadow-sm dark:bg-slate-800"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-bold">{lang === "ar" ? "EN" : "ع"}</span>
    </Button>
  );
}

function ThemeToggle({ theme, setTheme }: { theme: "light" | "dark"; setTheme: (t: "light" | "dark") => void }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="rounded-full bg-white px-3 shadow-sm dark:bg-slate-800"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}

function BottomNav({ page, setPage, t }: { page: Page; setPage: (p: Page) => void; t: Translation }) {
  const items: { id: Page; label: string; icon: React.ElementType }[] = [
    { id: "home", label: t.navHome, icon: Bike },
    { id: "orders", label: t.navOrders, icon: Package },
    { id: "complaints", label: t.navComplaints, icon: MessageSquareWarning },
    { id: "account", label: t.navAccount, icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[100] border-t border-yellow-200 bg-white/95 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-800/95">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const isActive = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all",
                isActive ? "text-yellow-500 dark:text-yellow-400" : "text-slate-400 dark:text-slate-500"
              )}
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-all", isActive && "bg-yellow-100 dark:bg-yellow-900/30")}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CustomOrderForm({ t, lang, onAdd, onClose }: { t: Translation; lang: Lang; onAdd: (item: any) => void; onClose: () => void }) {
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

function FlyingImage({ src, from, to, onComplete }: { src: string; from: { x: number; y: number }; to: { x: number; y: number }; onComplete: () => void }) {
  return (
    <div
      className="pointer-events-none fixed z-[200] h-20 w-20 overflow-hidden rounded-full shadow-2xl transition-all duration-700 ease-in-out"
      style={{
        left: from.x,
        top: from.y,
        transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(0.2) rotate(360deg)`,
        opacity: 0,
      }}
      onTransitionEnd={onComplete}
    >
      <img src={src} alt="flying" className="h-full w-full object-cover" />
    </div>
  );
}

function HomePage({ t, lang, cart, setCart, onCheckout, onAddToCart }: { t: Translation; lang: Lang; cart: Record<number, number>; setCart: (c: Record<number, number>) => void; onCheckout: () => void; onAddToCart: (product: any, rect: DOMRect) => void }) {
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

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
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
        <Input placeholder={t.searchPlaceholder} className="rounded-xl border-yellow-200 bg-white py-6 pl-10 shadow-sm dark:border-slate-700 dark:bg-slate-800" />
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
            <Card key={product.id} className="overflow-hidden border-none shadow-md">
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
                        <Button size="icon" variant="outline" className="h-7 w-7 rounded-full p-0" onClick={() => removeFromCart(product.id)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center text-sm font-bold">{cart[product.id]}</span>
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
              {t.checkout} <ArrowRight className="ms-2 h-4 w-4 rtl:rotate-180" />
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

function CheckoutModal({ t, lang, user, addresses, onClose, onConfirm }: { t: Translation; lang: Lang; user: any; addresses: any[]; onClose: () => void; onConfirm: (location: string) => void }) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState("");
  const [isNew, setIsNew] = useState(false);

  const handleConfirm = () => {
    if (isNew && newLocation.trim()) {
      onConfirm(newLocation.trim());
    } else if (selectedLocation) {
      onConfirm(selectedLocation);
    }
  };

  const isDisabled = (!isNew && !selectedLocation) || (isNew && !newLocation.trim());

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
                addresses.map((addr) => (
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

function OrdersPage({ t, lang, orders, setPage }: { t: Translation; lang: Lang; orders: any[]; setPage: (p: Page) => void }) {
  const statusColors: Record<string, string> = {
    onWay: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    preparing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.orders}</h1>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Package className="h-16 w-16 text-yellow-300" />
          <div>
            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t.emptyOrders}</h2>
            <p className="text-sm text-slate-400">{t.emptyOrdersDesc}</p>
          </div>
          <Button onClick={() => setPage("home")} className="rounded-full bg-yellow-400 text-slate-800 hover:bg-yellow-500">
            {t.startOrder}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Card key={order.id} className="border-yellow-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <div>
                  <CardTitle className="text-base text-slate-800 dark:text-white">{t.orderNumber}{order.id.split("-")[1]}</CardTitle>
                  <CardDescription className="text-xs">{order.date}</CardDescription>
                </div>
                <Badge className={cn("font-semibold", statusColors[order.status])}>
                  {t[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}` as keyof Translation] as string}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  {order.items.map((item: any, idx: number) => (
                    <Badge key={idx} variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      {item.qty}x {item.name[lang]}
                    </Badge>
                  ))}
                </div>
                
                {order.status === "preparing" && (
                  <div className="mb-3 rounded-xl bg-yellow-50 p-3 text-center dark:bg-yellow-900/20">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.arrivalTime}</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {Math.floor(order.timer / 60)}:{(order.timer % 60).toString().padStart(2, "0")}
                    </p>
                  </div>
                )}

                {order.status === "onWay" && (
                  <div className="mb-3 flex items-center gap-3 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/20">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
                      <Bike className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.captainName}</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white" dir="ltr">+963959213692</p>
                    </div>
                    <a href="tel:+963959213692">
                      <Button size="icon" className="rounded-full bg-blue-500 hover:bg-blue-600">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>{order.items.length} {t.items}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{order.total} {t.currency}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ComplaintsPage({ t, lang, user }: { t: Translation; lang: Lang; user: any }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Simulate API call to submit complaint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setSubject("");
      setDetails("");
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.complaints}</h1>
      {submitted ? (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="font-semibold text-green-700 dark:text-green-400">{t.complaintSubmitted}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.complaintSubject}</label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} required className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.complaintDetails}</label>
                <Textarea value={details} onChange={(e) => setDetails(e.target.value)} required rows={4} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
              </div>
              <Button type="submit" disabled={submitting} className="rounded-full bg-yellow-400 text-slate-800 hover:bg-yellow-500 disabled:opacity-50">
                {submitting ? t.submitting : t.submitComplaint}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// --- Account Sub-Views (Inline) ---

function EditProfileView({ t, user, setUser, onBack }: { t: Translation; user: any; setUser: (u: any) => void; onBack: () => void }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [homeAddress, setHomeAddress] = useState(user.homeAddress);
  const [updated, setUpdated] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ ...user, name, phone, homeAddress });
    setUpdated(true);
    setTimeout(onBack, 1500);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowRight className="h-5 w-5 rotate-180 rtl:rotate-0" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.editProfileTitle}</h1>
      </div>
      {updated ? (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="font-semibold text-green-700 dark:text-green-400">{t.profileUpdated}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-4">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.fullName}</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.phoneNumber}</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.homeAddress}</label>
                <Textarea value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} required rows={3} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
              </div>
              <Button type="submit" className="mt-2 rounded-full bg-yellow-400 text-slate-800 hover:bg-yellow-500">{t.save}</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AddressesView({ t, lang, addresses, setAddresses, onBack }: { t: Translation; lang: Lang; addresses: any[]; setAddresses: (a: any[]) => void; onBack: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [label, setLabel] = useState("");
  const [details, setDetails] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses([...addresses, { id: Date.now(), label, details }]);
    setLabel("");
    setDetails("");
    setShowForm(false);
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses(addresses.map(addr => addr.id === editingId ? { ...addr, label, details } : addr));
    setLabel("");
    setDetails("");
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (confirm(t.deleteAddressConfirm)) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const startEdit = (addr: any) => {
    setEditingId(addr.id);
    setLabel(addr.label);
    setDetails(addr.details);
    setShowForm(false);
  };

  const isFormOpen = showForm || editingId !== null;

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowRight className="h-5 w-5 rotate-180 rtl:rotate-0" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.addresses}</h1>
        </div>
        {!isFormOpen && (
          <Button size="sm" className="rounded-full bg-yellow-400 text-slate-800 hover:bg-yellow-500" onClick={() => setShowForm(true)}>
            <Plus className="me-1 h-4 w-4" /> {t.addAddress}
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <Card className="border-yellow-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <CardContent className="p-4">
            <form onSubmit={editingId !== null ? handleEdit : handleAdd} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.addressLabel}</label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} required placeholder={t.home} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.addressDetails}</label>
                <Textarea value={details} onChange={(e) => setDetails(e.target.value)} required rows={3} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 rounded-full bg-yellow-400 text-slate-800 hover:bg-yellow-500">{t.save}</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 rounded-full" 
                  onClick={() => { setShowForm(false); setEditingId(null); setLabel(""); setDetails(""); }}
                >
                  {t.cancel}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Navigation className="h-12 w-12 text-slate-300" />
              <p className="text-slate-400">{t.noAddresses}</p>
            </div>
          ) : (
            addresses.map((addr) => (
              <Card key={addr.id} className="border-yellow-100 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    {addr.label.includes(t.home) || addr.label.toLowerCase().includes("home") ? <Home className="h-5 w-5 text-yellow-600" /> : <Briefcase className="h-5 w-5 text-yellow-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-white">{addr.label}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{addr.details}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-yellow-100 dark:hover:bg-slate-700" onClick={() => startEdit(addr)}>
                      <Pencil className="h-4 w-4 text-slate-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20" onClick={() => handleDelete(addr.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function HelpView({ t, onBack }: { t: Translation; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowRight className="h-5 w-5 rotate-180 rtl:rotate-0" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.helpCenter}</h1>
      </div>
      <Card className="border-none bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm dark:from-green-900/10 dark:to-emerald-900/10">
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-green-500" width="24" height="24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <p className="text-slate-600 dark:text-slate-300">{t.whatsappSupport}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white" dir="ltr">{t.whatsappNumber}</p>
          <a href="https://wa.me/962959213962" target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full rounded-full bg-green-500 hover:bg-green-600">
              {t.whatsappSupport}
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}

function AccountPage({ t, lang, user, setUser, addresses, setAddresses }: { t: Translation; lang: Lang; user: any; setUser: (u: any) => void; addresses: any[]; setAddresses: (a: any[]) => void }) {
  const [view, setView] = useState<"main" | "edit" | "addresses" | "help">("main");

  if (view === "edit") return <EditProfileView t={t} user={user} setUser={setUser} onBack={() => setView("main")} />;
  if (view === "addresses") return <AddressesView t={t} lang={lang} addresses={addresses} setAddresses={setAddresses} onBack={() => setView("main")} />;
  if (view === "help") return <HelpView t={t} onBack={() => setView("main")} />;

  const menuItems = [
    { id: "edit" as const, icon: User, label: t.editProfile },
    { id: "addresses" as const, icon: Navigation, label: t.addresses },
    { id: "payment" as const, icon: Package, label: t.paymentMethods },
    { id: "help" as const, icon: MessageSquareWarning, label: t.helpCenter },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 pt-12">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.account}</h1>
      <Card className="border-yellow-100 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-sm dark:border-yellow-900/30 dark:from-yellow-900/10 dark:to-amber-900/10">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-2xl font-bold text-slate-800 shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.welcomeBack}</p>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{user.name}</h2>
            <p className="text-xs text-slate-400" dir="ltr">{user.phone}</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => item.id !== "payment" && setView(item.id)} 
            className="flex items-center justify-between rounded-xl bg-white p-4 text-start shadow-sm transition-colors hover:bg-yellow-50 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-slate-700">
                <item.icon className="h-5 w-5 text-yellow-500" />
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400 rtl:rotate-180" />
          </button>
        ))}
        <Separator className="my-2" />
        <button className="flex items-center justify-center gap-2 rounded-xl bg-red-50 p-4 font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
          {t.logout}
        </button>
      </div>
    </div>
  );
}

// --- Onboarding Component ---
function Onboarding({ t, onComplete }: { t: Translation; onComplete: (data: { name: string; phone: string; homeAddress: string }) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [error, setError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
    if (value.length > 0 && !value.startsWith("09")) {
      setError(t.phoneError);
    } else if (value.length > 10) {
      setError(t.phoneError);
    } else {
      setError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Final validation check
    if (!phone.startsWith("09") || phone.length !== 10) {
      setError(t.phoneError);
      return;
    }
    onComplete({ name, phone, homeAddress });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100 p-6 dark:from-slate-900 dark:to-slate-800">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/30">
          <Bike className="h-10 w-10 text-slate-800" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t.welcomeTitle}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.welcomeDesc}</p>
        </div>
      </div>
      <Card className="w-full border-yellow-200 bg-white/80 shadow-xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.fullName}</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder={t.welcomeNamePlaceholder} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.phoneNumber}</label>
              <Input 
                type="tel" 
                value={phone} 
                onChange={handlePhoneChange} 
                required 
                placeholder="09xxxxxxxx" 
                className={cn("rounded-xl dark:border-slate-600 dark:bg-slate-700", error && "border-red-500 focus-visible:ring-red-500")} 
                pattern="[0-9]*" 
                inputMode="numeric"
                maxLength={10}
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t.homeAddress}</label>
              <Textarea value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} required placeholder={t.welcomeAddressPlaceholder} rows={3} className="rounded-xl dark:border-slate-600 dark:bg-slate-700" />
            </div>
            <Button type="submit" className="mt-2 rounded-full bg-yellow-400 py-6 text-base font-bold text-slate-800 hover:bg-yellow-500">
              {t.startUsing}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Lang>("ar");
  const [theme, setTheme] = useState<"light" | "dark">("light");
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

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("noah_user");
      const savedAddresses = localStorage.getItem("noah_addresses");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch (e) {
      console.error("Failed to load user data", e);
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("noah_user", JSON.stringify(user));
    }
  }, [user]);

  // Save addresses to localStorage whenever they change
  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem("noah_addresses", JSON.stringify(addresses));
    }
  }, [addresses]);

  // Timer effect for active orders
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev => prev.map(order => {
        if (order.status === "preparing" && order.timer > 0) {
          return { ...order, timer: order.timer - 1 };
        } else if (order.status === "preparing" && order.timer === 0) {
          return { ...order, status: "onWay" };
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

    // Remove after animation
    setTimeout(() => {
      setFlyingImages(prev => prev.filter(img => img.id !== id));
    }, 800);
  };

  const handleCheckoutConfirm = async (location: string) => {
    setShowCheckout(false);
    
    const cartItems = Object.entries(cart).map(([id, qty]) => {
      const product = mockProducts.find(p => p.id === Number(id))!;
      return { name: product.name, qty, price: product.price };
    });
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    try {
      // Simulate API call to create order
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "preparing",
        total,
        date: new Date().toISOString().split('T')[0],
        items: cartItems,
        location,
        timer: 300, // 5 minutes countdown
      };
      
      setOrders([newOrder, ...orders]);
      setCart({});
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setPage("orders");
      }, 2000);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const pageIndex = getPageIndex(page);
  const directionMultiplier = lang === "ar" ? 1 : -1;
  const translateXValue = pageIndex * 100 * directionMultiplier;

  // Show onboarding if user is not set
  if (!user) {
    return (
      <div dir={lang === "ar" ? "rtl" : "ltr"} className={cn("min-h-screen bg-yellow-50", theme === "dark" && "dark bg-slate-950")}>
        <div className="relative mx-auto h-screen max-w-md overflow-hidden bg-yellow-50 shadow-2xl shadow-yellow-300/20 dark:bg-slate-900 dark:shadow-black/20">
          <div className="absolute end-4 top-4 z-50 flex gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <LanguageToggle lang={lang} setLang={setLang} />
          </div>
          <Onboarding t={t} onComplete={handleOnboardingComplete} />
        </div>
      </div>
    );
  }

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className={cn("min-h-screen bg-yellow-50", theme === "dark" && "dark bg-slate-950")}>
      <div className="relative mx-auto h-screen max-w-md overflow-hidden bg-yellow-50 shadow-2xl shadow-yellow-300/20 dark:bg-slate-900 dark:shadow-black/20">
        
        <div className="absolute end-4 top-4 z-50 flex gap-2">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>

        <div 
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${translateXValue}%)` }}
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
            onClose={() => setShowCheckout(false)} 
            onConfirm={handleCheckoutConfirm}
          />
        )}

        {showSuccess && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="mx-4 border-yellow-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <ChefHat className="h-10 w-10 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t.orderPreparing}</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.orderPreparingDesc}</p>
                </div>
              </CardContent>
            </Card>
          </div>
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