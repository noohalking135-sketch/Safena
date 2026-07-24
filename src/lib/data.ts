export interface Product {
  id: string;
  name: { ar: string; en: string };
  desc: { ar: string; en: string };
  price: number;
  image: string;
  rating: number;
  time: string;
}

export interface Category {
  id: string;
  name: { ar: string; en: string };
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: "food", name: { ar: "طعام", en: "Food" }, icon: "🍔", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" },
  { id: "drinks", name: { ar: "مشروبات", en: "Drinks" }, icon: "🥤", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { id: "clothes", name: { ar: "ألبسة", en: "Clothing" }, icon: "👕", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
  { id: "groceries", name: { ar: "بقالة", en: "Groceries" }, icon: "🛒", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { id: "electronics", name: { ar: "إلكترونيات", en: "Electronics" }, icon: "📱", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" },
  { id: "pharmacy", name: { ar: "صيدلية", en: "Pharmacy" }, icon: "💊", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" },
];

export const products: Product[] = [
  // Food
  { id: "f1", name: { ar: "برجر دبل تشيز", en: "Double Cheeseburger" }, desc: { ar: "لحم بقري، جبن شيدر، صلصة خاصة", en: "Beef, cheddar, special sauce" }, price: 35, image: "https://images.unsplash.com/photo-1568901346375-23c3450c7d24?w=400", rating: 4.8, time: "25" },
  { id: "f2", name: { ar: "بيتزا مارجريتا", en: "Margherita Pizza" }, desc: { ar: "صلصة طماطم، موزاريلا، ريحان", en: "Tomato sauce, mozzarella, basil" }, price: 45, image: "https://images.unsplash.com/photo-1604068549290-ee8385712b3d?w=400", rating: 4.7, time: "30" },
  { id: "f3", name: { ar: "سوشي رول", en: "Sushi Roll" }, desc: { ar: "أرز، سلمون، أفوكادو", en: "Rice, salmon, avocado" }, price: 60, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4d51?w=400", rating: 4.9, time: "40" },
  { id: "f4", name: { ar: "برياني لحم", en: "Mutton Biryani" }, desc: { ar: "أرز بسمتي، لحم، توابل", en: "Basmati rice, mutton, spices" }, price: 40, image: "https://images.unsplash.com/photo-1563379091339-2c29e8c45b48?w=400", rating: 4.6, time: "35" },
  
  // Drinks
  { id: "d1", name: { ar: "آيس لاتيه", en: "Iced Latte" }, desc: { ar: "إسبريسو، حليب، ثلج", en: "Espresso, milk, ice" }, price: 15, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d835?w=400", rating: 4.5, time: "15" },
  { id: "d2", name: { ar: "عصير برتقال طازج", en: "Fresh Orange Juice" }, desc: { ar: "برتقال طبيعي 100%", en: "100% natural orange" }, price: 12, image: "https://images.unsplash.com/photo-1613478223719-2e1f4d84e2c4?w=400", rating: 4.7, time: "10" },
  { id: "d3", name: { ar: "موكا فرابيه", en: "Mocha Frappe" }, desc: { ar: "قهوة، شوكولاتة، كريمة", en: "Coffee, chocolate, cream" }, price: 20, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d835?w=400", rating: 4.8, time: "15" },
  
  // Clothes
  { id: "c1", name: { ar: "تيشيرت قطن", en: "Cotton T-Shirt" }, desc: { ar: "قطن 100%، متوفر بعدة ألوان", en: "100% cotton, multiple colors" }, price: 80, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", rating: 4.4, time: "60" },
  { id: "c2", name: { ar: "جينز سليم", en: "Slim Jeans" }, desc: { ar: "قماش مرن، قصة عصرية", en: "Stretch fabric, modern fit" }, price: 150, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", rating: 4.6, time: "60" },
  { id: "c3", name: { ar: "هودي شتوي", en: "Winter Hoodie" }, desc: { ar: "حار وناعم، مثالي للشتاء", en: "Warm and soft, perfect for winter" }, price: 120, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400", rating: 4.7, time: "60" },

  // Groceries
  { id: "g1", name: { ar: "خبز طازج", en: "Fresh Bread" }, desc: { ar: "مخبوز يومياً", en: "Baked daily" }, price: 5, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", rating: 4.5, time: "20" },
  { id: "g2", name: { ar: "حليب طازج 1ل", en: "Fresh Milk 1L" }, desc: { ar: "حليب كامل الدسم", en: "Full cream milk" }, price: 8, image: "https://images.unsplash.com/photo-1563636664-5b9d9bd14151?w=400", rating: 4.6, time: "20" },
  
  // Electronics
  { id: "e1", name: { ar: "سماعات بلوتوث", en: "Bluetooth Earbuds" }, desc: { ar: "عزل ضوضاء، بطارية 20 ساعة", en: "Noise cancel, 20h battery" }, price: 250, image: "https://images.unsplash.com/photo-1606220945770-5c0c9b1b1b1b?w=400", rating: 4.5, time: "120" },
  { id: "e2", name: { ar: "شاحن سريع", en: "Fast Charger" }, desc: { ar: "65 واط، USB-C", en: "65W, USB-C" }, price: 90, image: "https://images.unsplash.com/photo-1583863788434-e58e6811ce58?w=400", rating: 4.4, time: "120" },

  // Pharmacy
  { id: "p1", name: { ar: "فيتامين سي", en: "Vitamin C" }, desc: { ar: "1000mg، 60 قرص", en: "1000mg, 60 tablets" }, price: 35, image: "https://images.unsplash.com/photo-1584308666744-24d5f91d6c3b?w=400", rating: 4.8, time: "30" },
  { id: "p2", name: { ar: "مجموعة إسعافات", en: "First Aid Kit" }, desc: { ar: "حقيبة كاملة", en: "Complete kit" }, price: 65, image: "https://images.unsplash.com/photo-1603398938373-e54eab446b87?w=400", rating: 4.7, time: "30" },
];
