import { Client, Databases } from "appwrite";

const client = new Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProjectId("معرف_مشروعك_الحقيقي_هنا");

export const databases = new Databases(client);

export const DATABASE_ID = "main_db"; 
export const ORDERS_COLLECTION_ID = "orders"; 
