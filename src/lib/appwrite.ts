import { Client, Databases } from "appwrite";

// إعداد الاتصال الأساسي مع Appwrite
const client = new Client();

client
.setEndpoint("https://cloud.appwrite.io/v1") // ضع رابط خادم Appwrite الخاص بك إذا كان مختلفاً
.setProjectId("YOUR_PROJECT_ID"); // استبدل هذا بمعرف مشروعك في Appwrite

export const databases = new Databases(client);

// معرّفات قاعدة البيانات والجداول الخاصة بك
export const DATABASE_ID = "main_db"; // اسم أو معرف قاعدة البيانات لديك
export const ORDERS_COLLECTION_ID = "orders"; // معرف جدول الطلبات