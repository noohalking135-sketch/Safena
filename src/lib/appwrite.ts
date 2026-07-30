import { Client, Databases } from 'appwrite';

export const APPWRITE_CONFIG = {
  endpoint: 'https://tor.cloud.appwrite.io/v1',
  projectId: '6a658f7200183d84195b', // المعرّف الصحيح للمشروع الجديد
  databaseId: '6a65915e00291cf7f54c', // معرّف قاعدة البيانات لديك
  ordersCollectionId: 'orders',
  complaintsCollectionId: 'complaints',
};

// توافقية مع الأسماء التي تستخدمها بعض المكونات
export const APPWRITE_ENDPOINT = APPWRITE_CONFIG.endpoint;
export const APPWRITE_PROJECT_ID = APPWRITE_CONFIG.projectId;
export const APPWRITE_DATABASE_ID = APPWRITE_CONFIG.databaseId;
export const ORDERS_TABLE_ID = APPWRITE_CONFIG.ordersCollectionId;
export const COMPLAINTS_TABLE_ID = APPWRITE_CONFIG.complaintsCollectionId;

export const client = new Client();
client
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const databases = new Databases(client);
