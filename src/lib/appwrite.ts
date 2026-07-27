import { Client, Databases } from "appwrite";

const client = new Client();

// قراءة معرف المشروع من متغيرات البيئة أو وضعه مباشرة هنا بين الأقواس
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "ضع_معرف_مشروعك_هنا";

client
.setEndpoint("https://cloud.appwrite.io/v1")
.setProjectId(PROJECT_ID);

export const databases = new Databases(client);

export const DATABASE_ID = "main_db";
export const ORDERS_COLLECTION_ID = "orders";