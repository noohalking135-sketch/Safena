import { Client, Databases } from "appwrite";

const client = new Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProjectId("6a658f7200183d84195b");

export const databases = new Databases(client);

export const DATABASE_ID = "main_db"; 
export const ORDERS_COLLECTION_ID = "orders"; //
