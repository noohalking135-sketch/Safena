import { Client, Databases } from "appwrite";

const client = new Client();

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "6a658f7200183d84195b";

client
.setEndpoint("https://cloud.appwrite.io/v1")
.setProjectId(PROJECT_ID);

export const databases = new Databases(client);

export const DATABASE_ID = "main_db";
export const ORDERS_COLLECTION_ID = "orders";