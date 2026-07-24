import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, ShoppingBag, Star, User, Heart, Search, Package, Ship, Languages, ChevronLeft, Phone, MapPin, MessageCircle, Pencil } from "lucide-react";

// --- Types ---
type Category = "food" | "clothing" | "electronics";
type Vendor = "Imbrio" | "Al-Qusour" | "On-Your-Taste" | "Adidas" | "Nike" | "General";
type Lang = "ar" | "en";

interface Product {
  id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  price: number;
  category: Category;
  vendor: Vendor;
  image: string;
}

interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface UserProfile {
  name: string;
  phone: string;
  address: string;
}

// --- Data ---
const VENDOR_NAMES: Record<Vendor, { ar: string; en: string }> = {
  "Imbrio": { ar: "مطعم إمبريو", en: "Imbrio Restaurant" },
  "Al-Qusour": { ar: "فروج القصور", en: "Al-Qusour Chicken" },
  "On-Your-Taste": { ar: "مطعم ع ذوقك", en: "On Your Taste" },
  "Adidas": { ar: "أديداس", en: "Adidas" },
  "Nike": { ar: "نايكي", en: "Nike" },
  "General": { ar: "متجر إلكترونيات", en: "Electronics Store" },
};

const CATEGORY_INFO: Record<Category, { label: { ar: string; en: string }; image: string; color: string }> = {
  food: { 
    label: { ar: "الأطعمة", en: "Food" }, 
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80", 
    color: "bg-amber-500" 
  },
  clothing: { 
    label: { ar: "الألبسة", en: "Clothing" }, 
    image: "https://images.unsplash.com/photo-1445205170232-0eb4cfe5c1f4?w=600&q=80", 
    color: "bg-emerald-500" 
  },
  electronics: { 
    label: { ar: "الأغراض الإلكترونية", en: "Electronics" }, 
    image: "https://images.unsplash.com/photo-1498049794561-1a024a07df91?w=600&q=80", 
    color: "bg-sky-500" 
  },
};

const PRODUCTS: Product[] = [
  { id: "p1", name: { ar: "شاورما", en: "Shawarma" }, description: { ar: "شاورما لذيذة مع صوص خاص", en: "Delicious shawarma with special sauce" }, price: 25000, category: "food", vendor: "Imbrio", image: "https://images.unsplash.com/photo-1605146768851-eda79da39894?w=400&q=80" },
  { id: "p2", name: { ar: "كريسبي", en: "Crispy" }, description: { ar: "دجاج مقرمش بطبقة ذهبية", en: "Crispy chicken with golden coating" }, price: 30000, category: "food", vendor: "Imbrio", image: "https://images.unsplash.com/photo-1626645738196-c2a7c6a8a3c0?w=400&q=80" },
  { id: "p3", name: { ar: "فاهيتا", en: "Fajita" }, description: { ar: "فاهيتا بالخضار والدجاج", en: "Fajita with vegetables and chicken" }, price: 28000, category: "food", vendor: "Imbrio", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865d47?w=400&q=80" },
  { id: "p4", name: { ar: "فروج مشوي", en: "Grilled Chicken" }, description: { ar: "فروج مشوي على الفحم", en: "Charcoal grilled chicken" }, price: 22000, category: "food", vendor: "Al-Qusour", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&q=80" },
  { id: "p5", name: { ar: "فروج بروستد", en: "Broasted Chicken" }, description: { ar: "بروستد مقرمش بخلطة سرية", en: "Crispy broasted with secret mix" }, price: 24000, category: "food", vendor: "Al-Qusour", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80" },
  { id: "p6", name: { ar: "شاورما", en: "Shawarma" }, description: { ar: "شاورما لحم طازجة", en: "Fresh meat shawarma" }, price: 20000, category: "food", vendor: "Al-Qusour", image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80" },
  { id: "p7", name: { ar: "فطيرة محمرة بالقشقوان", en: "Roasted Cheese Pastry" }, description: { ar: "فطيرة محمرة بالقشقوان", en: "Roasted Kashkaval pastry" }, price: 15000, category: "food", vendor: "On-Your-Taste", image: "https://images.unsplash.com/photo-1565299624946-b283c0de4f1c?w=400&q=80" },
  { id: "p8", name: { ar: "فطيرة جبنة", en: "Cheese Pastry" }, description: { ar: "فطيرة بالجبنة الطازجة", en: "Pastry with fresh cheese" }, price: 12000, category: "food", vendor: "On-Your-Taste", image: "https://images.unsplash.com/photo-1639024471283-0350e1c1d3b1?w=400&q=80" },
  { id: "p9", name: { ar: "فطيرة زعتر", en: "Thyme Pastry" }, description: { ar: "فطيرة بالزعتر البلدي", en: "Pastry with local thyme" }, price: 10000, category: "food", vendor: "On-Your-Taste", image: "https://images.unsplash.com/photo-1601314167099-3c8a1c9b1b1b?w=400&q=80" },
  { id: "p10", name: { ar: "حذاء رياضي", en: "Sneakers" }, description: { ar: "حذاء رياضي مريح", en: "Comfortable sports shoes" }, price: 150000, category: "clothing", vendor: "Adidas", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { id: "p11", name: { ar: "جاكيت", en: "Jacket" }, description: { ar: "جاكيت رياضي أنيق", en: "Elegant sports jacket" }, price: 200000, category: "clothing", vendor: "Adidas", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80" },
  { id: "p12", name: { ar: "حذاء جري", en: "Running Shoes" }, description: { ar: "حذاء جري خفيف", en: "Lightweight running shoes" }, price: 180000, category: "clothing", vendor: "Nike", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { id: "p13", name: { ar: "تيشيرت", en: "T-Shirt" }, description: { ar: "تيشيرت قطني ناعم", en: "Soft cotton t-shirt" }, price: 90000, category: "clothing", vendor: "Nike", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80" },
  { id: "p14", name: { ar: "سماعات لاسلكية", en: "Wireless Headphones" }, description: { ar: "سماعات بلوتوث عالية الجودة", en: "High quality bluetooth headphones" }, price: 120000, category: "electronics", vendor: "General", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
  { id: "p15", name: { ar: "ساعة ذكية", en: "Smart Watch" }, description: { ar: "ساعة ذكية بشاشة لمس", en: "Smart watch with touch screen" }, price: 250000, category: "electronics", vendor: "General", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
  { id: "p16", name: { ar: "شاحن سريع", en: "Fast Charger" }, description: { ar: "شاحن سريع 30W", en: "30W fast charger" }, price: 45000, category: "electronics", vendor: "General", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80" },
];

const STORAGE_KEY = "safina_noah_profile";

// --- Main App Component ---
export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Lang>("ar");
  const [activeTab, setActiveTab] = useState<"home" | "products" | "reviews" | "account">("home");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState<Review[]>([
    { id: "r1", productId: "p1", userName: "أحمد", rating: 5, comment: "شاورما رائعة جداً!", date: "2024-01-15" },
    { id: "r2", productId: "p1", userName: "سارة", rating: 4, comment: "طيبة بس السعر غالي شوي", date: "2024-01-20" },
    { id: "r3", productId: "p4", userName: "محمد", rating: 5, comment: "أفضل فروج مشوي بالمنطقة", date: "2024-02-01" },
  ]);
  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);
  const [newReview, setNewReview] = useState({ userName: "", rating: 5, comment: "" });
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    }
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
    setProfile(newProfile);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error("Failed to save profile", e);
    }
    setProfile(updatedProfile);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
      if (selectedVendor !== "all" && p.vendor !== selectedVendor) return false;
      if (searchQuery && !p.name[lang].includes(searchQuery) && !p.description[lang].includes(searchQuery)) return false;
      return true;
    });
  }, [selectedCategory, selectedVendor, searchQuery, lang]);

  const availableVendors = useMemo(() => {
    if (selectedCategory === "all") return Object.keys(VENDOR_NAMES) as Vendor[];
    return Array.from(new Set(PRODUCTS.filter(p => p.category === selectedCategory).map(p => p.vendor)));
  }, [selectedCategory]);

  const productReviews = (productId: string) => reviews.filter((r) => r.productId === productId);
  const avgRating = (productId: string) => {
    const rs = productReviews(productId);
    if (rs.length === 0) return 0;
    return rs.reduce((sum, r) => sum + r.rating, 0) / rs.length;
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const submitReview = () => {
    if (!reviewingProduct || !newReview.userName || !newReview.comment) return;
    setReviews((prev) => [
      ...prev,
      { id: `r${Date.now()}`, productId: reviewingProduct.id, userName: newReview.userName, rating: newReview.rating, comment: newReview.comment, date: new Date().toISOString().split("T")[0] },
    ]);
    setNewReview({ userName: "", rating: 5, comment: "" });
    setReviewingProduct(null);
  };

  const t = {
    appName: lang === "ar" ? "سفينة نوح" : "Noah's Ship",
    tagline: lang === "ar" ? "خدمة توصيل سريعة" : "Fast Delivery Service",
    home: lang === "ar" ? "الرئيسية" : "Home",
    products: lang === "ar" ? "المنتجات" : "Products",
    reviews: lang === "ar" ? "التقييمات" : "Reviews",
    account: lang === "ar" ? "حسابي" : "Account",
    heroTitle: lang === "ar" ? "وصلك طلبك بسرعة" : "Fast Delivery to Your Door",
    heroDesc: lang === "ar" ? "أطعمة، ألبسة، وإلكترونيات" : "Food, Clothing & Electronics",
    categories: lang === "ar" ? "الأصناف" : "Categories",
    featured: lang === "ar" ? "الأكثر طلباً" : "Most Popular",
    searchPlaceholder: lang === "ar" ? "ابحث عن منتج..." : "Search for a product...",
    all: lang === "ar" ? "الكل" : "All",
    vendorLabel: lang === "ar" ? "المطعم / المحل" : "Restaurant / Shop",
    noProducts: lang === "ar" ? "لا توجد منتجات مطابقة" : "No matching products",
    reviewsTitle: lang === "ar" ? "تقييمات العملاء" : "Customer Reviews",
    reviewsCount: lang === "ar" ? "تقييم من عملائنا الكرام" : "reviews from our customers",
    noReviews: lang === "ar" ? "لا توجد تقييمات بعد" : "No reviews yet",
    reviewName: lang === "ar" ? "اسمك" : "Your Name",
    reviewNamePlaceholder: lang === "ar" ? "اكتب اسمك" : "Enter your name",
    reviewRating: lang === "ar" ? "التقييم" : "Rating",
    reviewComment: lang === "ar" ? "تعليقك" : "Your Comment",
    reviewCommentPlaceholder: lang === "ar" ? "شاركنا رأيك..." : "Share your opinion...",
    submitReview: lang === "ar" ? "إرسال التقييم" : "Submit Review",
    cancel: lang === "ar" ? "إلغاء" : "Cancel",
    currency: lang === "ar" ? "ل.س" : "SYP",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50/30 flex items-center justify-center">
        <Ship className="w-12 h-12 text-amber-400 animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-amber-50/30 pb-24" dir={lang === "ar" ? "rtl" : "ltr"}>
      <LanguageToggle lang={lang} setLang={setLang} />
      
      {/* Header */}
      <header className="bg-white border-b border-amber-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm">
              <Ship className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight text-stone-800" style={{ fontFamily: "serif" }}>
                {t.appName}
              </h1>
              <p className="text-amber-500 text-[10px] font-medium tracking-wider">{t.tagline}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === "home" && (
          <HomeTab onCategoryClick={(cat) => { setSelectedCategory(cat); setActiveTab("products"); }} favorites={favorites} products={PRODUCTS} avgRating={avgRating} lang={lang} t={t} />
        )}
        {activeTab === "products" && (
          <ProductsTab
            products={filteredProducts}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedVendor={selectedVendor}
            setSelectedVendor={setSelectedVendor}
            availableVendors={availableVendors}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            avgRating={avgRating}
            reviewCount={(id: string) => productReviews(id).length}
            onReviewClick={setReviewingProduct}
            lang={lang}
            t={t}
          />
        )}
        {activeTab === "reviews" && <ReviewsTab reviews={reviews} products={PRODUCTS} lang={lang} t={t} />}
        {activeTab === "account" && <AccountTab favorites={favorites} products={PRODUCTS} profile={profile} onUpdateProfile={handleUpdateProfile} lang={lang} />}
      </main>

      {/* Review Dialog */}
      {reviewingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setReviewingProduct(null)}>
          <Card className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border-amber-100" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="bg-amber-50 rounded-t-3xl sm:rounded-t-2xl">
              <div className="flex items-center gap-3">
                <img src={reviewingProduct.image} alt={reviewingProduct.name[lang]} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-lg text-stone-800">{reviewingProduct.name[lang]}</h3>
                  <p className="text-sm text-stone-500">{VENDOR_NAMES[reviewingProduct.vendor][lang]}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label>{t.reviewName}</Label>
                <Input value={newReview.userName} onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })} placeholder={t.reviewNamePlaceholder} className="mt-1" />
              </div>
              <div>
                <Label>{t.reviewRating}</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })} className="transition-transform hover:scale-110">
                      <Star className={`w-8 h-8 ${star <= newReview.rating ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>{t.reviewComment}</Label>
                <Textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder={t.reviewCommentPlaceholder} className="mt-1" rows={3} />
              </div>
              <div className="flex gap-2">
                <Button onClick={submitReview} className="flex-1 bg-amber-400 hover:bg-amber-500 text-stone-800 font-bold">{t.submitReview}</Button>
                <Button variant="outline" onClick={() => setReviewingProduct(null)}>{t.cancel}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-1 px-2 py-2">
          {[
            { id: "home", label: t.home, icon: Home },
            { id: "products", label: t.products, icon: ShoppingBag },
            { id: "reviews", label: t.reviews, icon: Star },
            { id: "account", label: t.account, icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${active ? "text-amber-600 bg-amber-50" : "text-stone-400"}`}>
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// --- Sub Components ---
function LanguageToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <button 
      onClick={() => setLang(lang === "ar" ? "en" : "ar")} 
      className="fixed top-3 left-3 z-50 flex items-center gap-1.5 bg-white shadow-md rounded-full px-3 py-1.5 border border-amber-100 hover:bg-amber-50 transition-colors"
    >
      <Languages className="w-4 h-4 text-amber-600" />
      <span className="text-xs font-bold text-stone-700">{lang === "ar" ? "EN" : "ع"}</span>
    </button>
  );
}

function StarRating({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`${size} ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
      ))}
    </div>
  );
}

function Onboarding({ onComplete, lang }: { onComplete: (p: UserProfile) => void; lang: Lang }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});

  const handleSubmit = () => {
    const newErrors = {
      name: !name.trim(),
      phone: !phone.trim(),
      address: !address.trim(),
    };
    if (newErrors.name || newErrors.phone || newErrors.address) {
      setErrors(newErrors);
      return;
    }
    onComplete({ name, phone, address });
  };

  const t = {
    title: lang === "ar" ? "سفينة نوح" : "Noah's Ship",
    welcome: lang === "ar" ? "مرحباً بك! يرجى إدخال بياناتك للمتابعة" : "Welcome! Please enter your details to continue",
    name: lang === "ar" ? "الاسم" : "Name",
    namePlaceholder: lang === "ar" ? "اسمك الكامل" : "Your full name",
    phone: lang === "ar" ? "رقم الهاتف" : "Phone Number",
    phonePlaceholder: lang === "ar" ? "رقم هاتفك" : "Your phone number",
    address: lang === "ar" ? "العنوان" : "Address",
    addressPlaceholder: lang === "ar" ? "عنوانك بالتفصيل" : "Your detailed address",
    continue: lang === "ar" ? "متابعة" : "Continue",
    errName: lang === "ar" ? "الرجاء إدخال الاسم" : "Please enter your name",
    errPhone: lang === "ar" ? "الرجاء إدخال رقم الهاتف" : "Please enter your phone number",
    errAddress: lang === "ar" ? "الرجاء إدخال العنوان" : "Please enter your address",
  };

  return (
    <div className="fixed inset-0 bg-amber-50/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md rounded-3xl shadow-xl border-amber-100 overflow-hidden">
        <CardHeader className="bg-gradient-to-l from-amber-400 to-amber-300 p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-md">
              <Ship className="w-9 h-9 text-amber-500" />
            </div>
          </div>
          <h2 className="text-2xl text-stone-800 font-bold" style={{ fontFamily: "serif" }}>{t.title}</h2>
          <p className="text-amber-800 text-sm mt-1">{t.welcome}</p>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div>
            <Label>{t.name}</Label>
            <div className="relative mt-1">
              <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 ${lang === "ar" ? "right-3" : "left-3"}`} />
              <Input 
                value={name} 
                onChange={(e) => { setName(e.target.value); setErrors({...errors, name: false}); }} 
                className={lang === "ar" ? "pr-9" : "pl-9"} 
                placeholder={t.namePlaceholder} 
              />
            </div>
            {errors.name && <p className="text-rose-500 text-xs mt-1">{t.errName}</p>}
          </div>
          <div>
            <Label>{t.phone}</Label>
            <div className="relative mt-1">
              <Phone className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 ${lang === "ar" ? "right-3" : "left-3"}`} />
              <Input 
                value={phone} 
                onChange={(e) => { setPhone(e.target.value); setErrors({...errors, phone: false}); }} 
                className={lang === "ar" ? "pr-9" : "pl-9"} 
                placeholder={t.phonePlaceholder} 
                type="tel" 
              />
            </div>
            {errors.phone && <p className="text-rose-500 text-xs mt-1">{t.errPhone}</p>}
          </div>
          <div>
            <Label>{t.address}</Label>
            <div className="relative mt-1">
              <MapPin className={`absolute top-3 w-4 h-4 text-amber-400 ${lang === "ar" ? "right-3" : "left-3"}`} />
              <Textarea 
                value={address} 
                onChange={(e) => { setAddress(e.target.value); setErrors({...errors, address: false}); }} 
                className={lang === "ar" ? "pr-9" : "pl-9"} 
                rows={3} 
                placeholder={t.addressPlaceholder} 
              />
            </div>
            {errors.address && <p className="text-rose-500 text-xs mt-1">{t.errAddress}</p>}
          </div>
          <Button onClick={handleSubmit} className="w-full bg-amber-400 hover:bg-amber-500 text-stone-800 font-bold h-12 text-base">
            {t.continue}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductCard({ product, isFavorite, avgRating, reviewCount, onToggleFavorite, onReviewClick, lang, currency }: { 
  product: Product; 
  isFavorite: boolean; 
  avgRating: number; 
  reviewCount: number; 
  onToggleFavorite: (id: string) => void; 
  onReviewClick: (p: Product) => void; 
  lang: Lang; 
  currency: string;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow border-amber-100 group">
      <div className="relative h-32 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name[lang]} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <button 
          onClick={() => onToggleFavorite(product.id)} 
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : "text-stone-500"}`} />
        </button>
      </div>
      <CardContent className="p-3">
        <h3 className="font-bold text-sm text-stone-800 truncate">{product.name[lang]}</h3>
        <p className="text-xs text-stone-500 truncate">{VENDOR_NAMES[product.vendor][lang]}</p>
        <p className="text-xs text-stone-400 mt-1 line-clamp-1">{product.description[lang]}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-amber-600">{product.price.toLocaleString("en-US")} {currency}</span>
          {avgRating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs text-stone-600 font-medium">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-stone-400">({reviewCount})</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => onReviewClick(product)} 
          className="w-full mt-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors"
        >
          {lang === "ar" ? "أضف تقييم" : "Add Review"}
        </button>
      </CardContent>
    </Card>
  );
}

function HomeTab({ onCategoryClick, favorites, products, avgRating, lang, t }: { onCategoryClick: (cat: Category) => void; favorites: string[]; products: Product[]; avgRating: (id: string) => number; lang: Lang; t: any }) {
  const featured = products.slice(0, 4);
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden h-44 shadow-lg">
        <img src="https://images.unsplash.com/photo-1600891964599-fd88d0dc4a1c?w=800&q=80" alt="hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent" />
        <div className="absolute bottom-0 right-0 p-6 text-white">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "serif" }}>{t.heroTitle}</h2>
          <p className="text-sm text-white/80 mt-1">{t.heroDesc}</p>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-stone-800">{t.categories}</h3>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => (
            <button key={cat} onClick={() => onCategoryClick(cat)} className="group relative rounded-2xl overflow-hidden h-32 shadow-md hover:shadow-xl transition-shadow">
              <img src={CATEGORY_INFO[cat].image} alt={CATEGORY_INFO[cat].label[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-3 right-3 text-white font-bold text-sm">{CATEGORY_INFO[cat].label[lang]}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-stone-800">{t.featured}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((p) => (
            <Card key={p.id} className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow border-amber-100">
              <div className="relative h-28">
                <img src={p.image} alt={p.name[lang]} className="w-full h-full object-cover" />
                {favorites.includes(p.id) && <Heart className="absolute top-2 left-2 w-4 h-4 fill-rose-500 text-rose-500" />}
              </div>
              <CardContent className="p-3">
                <h4 className="font-bold text-sm text-stone-800 truncate">{p.name[lang]}</h4>
                <p className="text-xs text-stone-500 truncate">{VENDOR_NAMES[p.vendor][lang]}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-amber-600">{p.price.toLocaleString("en-US")} {t.currency}</span>
                  {avgRating(p.id) > 0 && <StarRating rating={avgRating(p.id)} size="w-3 h-3" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ products, selectedCategory, setSelectedCategory, selectedVendor, setSelectedVendor, availableVendors, searchQuery, setSearchQuery, favorites, toggleFavorite, avgRating, reviewCount, onReviewClick, lang, t }: {
  products: Product[];
  selectedCategory: Category | "all";
  setSelectedCategory: (c: Category | "all") => void;
  selectedVendor: Vendor | "all";
  setSelectedVendor: (v: Vendor | "all") => void;
  availableVendors: Vendor[];
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  avgRating: (id: string) => number;
  reviewCount: (id: string) => number;
  onReviewClick: (p: Product) => void;
  lang: Lang;
  t: any;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-white rounded-2xl p-3 shadow-sm border border-amber-100">
        <Search className="w-5 h-5 text-amber-400" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="border-0 shadow-none focus-visible:ring-0" />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button 
          onClick={() => { setSelectedCategory("all"); setSelectedVendor("all"); }} 
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === "all" ? "bg-amber-400 text-stone-800" : "bg-white text-stone-600 border border-amber-200"}`}
        >
          {t.all}
        </button>
        {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => (
          <button 
            key={cat} 
            onClick={() => { setSelectedCategory(cat); setSelectedVendor("all"); }} 
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? "bg-amber-400 text-stone-800" : "bg-white text-stone-600 border border-amber-200"}`}
          >
            {CATEGORY_INFO[cat].label[lang]}
          </button>
        ))}
      </div>

      {/* Vendor chips */}
      {selectedCategory !== "all" && (
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-amber-100">
          <Label className="text-xs text-stone-500 mb-2 block">{t.vendorLabel}</Label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button 
              onClick={() => setSelectedVendor("all")} 
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedVendor === "all" ? "bg-amber-400 text-stone-800" : "bg-stone-50 text-stone-600 border border-stone-200"}`}
            >
              {t.all}
            </button>
            {availableVendors.map((v) => (
              <button 
                key={v} 
                onClick={() => setSelectedVendor(v)} 
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedVendor === v ? "bg-amber-400 text-stone-800" : "bg-stone-50 text-stone-600 border border-stone-200"}`}
              >
                {VENDOR_NAMES[v][lang]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{t.noProducts}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isFavorite={favorites.includes(p.id)}
              avgRating={avgRating(p.id)}
              reviewCount={reviewCount(p.id)}
              onToggleFavorite={toggleFavorite}
              onReviewClick={onReviewClick}
              lang={lang}
              currency={t.currency}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewsTab({ reviews, products, lang, t }: { reviews: Review[]; products: Product[]; lang: Lang; t: any }) {
  const productMap = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const sortedReviews = [...reviews].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-l from-amber-400 to-amber-300 rounded-2xl p-5 text-stone-800 shadow-lg">
        <h2 className="text-xl font-bold" style={{ fontFamily: "serif" }}>{t.reviewsTitle}</h2>
        <p className="text-amber-800 text-sm mt-1">{reviews.length} {t.reviewsCount}</p>
      </div>

      {sortedReviews.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>{t.noReviews}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedReviews.map((r) => {
            const product = productMap[r.productId];
            return (
              <Card key={r.id} className="rounded-2xl shadow-sm border-amber-100">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-amber-100 text-amber-700 text-sm">{r.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-stone-800">{r.userName}</h4>
                        <span className="text-xs text-stone-400">{r.date}</span>
                      </div>
                      <StarRating rating={r.rating} size="w-3.5 h-3.5" />
                      <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">{r.comment}</p>
                      {product && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-amber-50">
                          <img src={product.image} alt={product.name[lang]} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-xs text-stone-500">{product.name[lang]} — {VENDOR_NAMES[product.vendor][lang]}</span>
                        </div>
                      )}
                    </div>
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

function AccountTab({ favorites, products, profile, onUpdateProfile, lang }: { favorites: string[]; products: Product[]; profile: UserProfile; onUpdateProfile: (p: UserProfile) => void; lang: Lang }) {
  const [view, setView] = useState<"main" | "edit" | "contact">("main");
  const [editProfile, setEditProfile] = useState(profile);
  const favProducts = products.filter((p) => favorites.includes(p.id));

  const t = {
    back: lang === "ar" ? "رجوع" : "Back",
    editTitle: lang === "ar" ? "تعديل الملف الشخصي" : "Edit Profile",
    name: lang === "ar" ? "الاسم" : "Name",
    phone: lang === "ar" ? "رقم الهاتف" : "Phone Number",
    address: lang === "ar" ? "العنوان" : "Address",
    namePlaceholder: lang === "ar" ? "اسم العميل" : "Customer Name",
    phonePlaceholder: lang === "ar" ? "رقم الهاتف" : "Phone Number",
    addressPlaceholder: lang === "ar" ? "العنوان بالتفصيل" : "Detailed Address",
    save: lang === "ar" ? "حفظ التغييرات" : "Save Changes",
    contactTitle: lang === "ar" ? "التواصل معنا" : "Contact Us",
    contactDesc: lang === "ar" ? "لأي استفسار أو شكوى، تواصل معنا عبر واتساب:" : "For any inquiries or complaints, contact us via WhatsApp:",
    whatsapp: lang === "ar" ? "واتساب" : "WhatsApp",
    favoritesCount: lang === "ar" ? "المفضلة" : "Favorites",
    orders: lang === "ar" ? "الطلبات" : "Orders",
    editProfile: lang === "ar" ? "تعديل الملف الشخصي" : "Edit Profile",
    contact: lang === "ar" ? "التواصل (واتساب)" : "Contact (WhatsApp)",
    favList: lang === "ar" ? "قائمة المفضلة" : "Favorites List",
    noFav: lang === "ar" ? "لا توجد منتجات في المفضلة بعد" : "No favorites yet",
    currency: lang === "ar" ? "ل.س" : "SYP",
  };

  if (view === "edit") {
    return (
      <div className="space-y-4">
        <button onClick={() => setView("main")} className="flex items-center gap-1 text-sm text-stone-600 font-medium">
          <ChevronLeft className="w-4 h-4" /> {t.back}
        </button>
        <Card className="rounded-2xl shadow-md border-amber-100">
          <CardHeader className="bg-amber-50 rounded-t-2xl">
            <h3 className="text-lg text-stone-800 font-bold">{t.editTitle}</h3>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label>{t.name}</Label>
              <div className="relative mt-1">
                <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 ${lang === "ar" ? "right-3" : "left-3"}`} />
                <Input value={editProfile.name} onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })} className={lang === "ar" ? "pr-9" : "pl-9"} placeholder={t.namePlaceholder} />
              </div>
            </div>
            <div>
              <Label>{t.phone}</Label>
              <div className="relative mt-1">
                <Phone className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 ${lang === "ar" ? "right-3" : "left-3"}`} />
                <Input value={editProfile.phone} onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })} className={lang === "ar" ? "pr-9" : "pl-9"} placeholder={t.phonePlaceholder} />
              </div>
            </div>
            <div>
              <Label>{t.address}</Label>
              <div className="relative mt-1">
                <MapPin className={`absolute top-3 w-4 h-4 text-stone-400 ${lang === "ar" ? "right-3" : "left-3"}`} />
                <Textarea value={editProfile.address} onChange={(e) => setEditProfile({ ...editProfile, address: e.target.value })} className={lang === "ar" ? "pr-9" : "pl-9"} rows={3} placeholder={t.addressPlaceholder} />
              </div>
            </div>
            <Button 
              className="w-full bg-amber-400 hover:bg-amber-500 text-stone-800 font-bold" 
              onClick={() => { onUpdateProfile(editProfile); setView("main"); }}
            >
              {t.save}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === "contact") {
    return (
      <div className="space-y-4">
        <button onClick={() => setView("main")} className="flex items-center gap-1 text-sm text-stone-600 font-medium">
          <ChevronLeft className="w-4 h-4" /> {t.back}
        </button>
        <Card className="rounded-2xl shadow-md border-amber-100 overflow-hidden">
          <CardHeader className="bg-amber-50 rounded-t-2xl">
            <h3 className="text-lg text-stone-800 font-bold">{t.contactTitle}</h3>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-stone-600">{t.contactDesc}</p>
            <a href="https://wa.me/963959213962" target="_blank" rel="noopener noreferrer" className="block">
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 hover:bg-green-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-700">{t.whatsapp}</p>
                  <p className="text-sm text-green-600" dir="ltr">+963 959 213 962</p>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl overflow-hidden shadow-md border-amber-100">
        <div className="bg-gradient-to-l from-amber-400 to-amber-300 p-6 text-stone-800">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-4 border-white/50">
              <AvatarFallback className="bg-amber-600 text-white text-xl">{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-amber-800 text-sm">{profile.phone}</p>
              <p className="text-amber-800 text-xs mt-0.5 truncate max-w-[200px]">{profile.address}</p>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{favorites.length}</p>
              <p className="text-xs text-stone-500 mt-1">{t.favoritesCount}</p>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-stone-600">0</p>
              <p className="text-xs text-stone-500 mt-1">{t.orders}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <button onClick={() => { setEditProfile(profile); setView("edit"); }} className="w-full bg-white rounded-2xl shadow-sm border border-amber-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Pencil className="w-5 h-5 text-amber-600" />
          </div>
          <span className="font-bold text-stone-800 flex-1 text-right">{t.editProfile}</span>
          <ChevronLeft className="w-5 h-5 text-stone-400" />
        </button>
        <button onClick={() => setView("contact")} className="w-full bg-white rounded-2xl shadow-sm border border-amber-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <span className="font-bold text-stone-800 flex-1 text-right">{t.contact}</span>
          <ChevronLeft className="w-5 h-5 text-stone-400" />
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-3 text-stone-800">{t.favList}</h3>
        {favProducts.length === 0 ? (
          <Card className="rounded-2xl border-amber-100">
            <CardContent className="p-8 text-center text-stone-400">
              <Heart className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{t.noFav}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {favProducts.map((p) => (
              <Card key={p.id} className="rounded-2xl shadow-sm border-amber-100">
                <CardContent className="p-3 flex items-center gap-3">
                  <img src={p.image} alt={p.name[lang]} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-stone-800 truncate">{p.name[lang]}</h4>
                    <p className="text-xs text-stone-500">{p.price.toLocaleString("en-US")} {t.currency}</p>
                  </div>
                  <Heart className="w-5 h-5 fill-rose-500 text-rose-500 flex-shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}