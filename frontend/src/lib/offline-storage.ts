// Offline storage utility using IndexedDB for order management
interface OfflineOrder {
  id: string;
  tableId: number;
  data: any;
  timestamp: number;
  synced: boolean;
}

interface OfflineData {
  tables: any[];
  menu: any[];
  lastSync: number;
}

class OfflineStorageManager {
  private dbName = 'RestaurantOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Orders store
        if (!db.objectStoreNames.contains('orders')) {
          const ordersStore = db.createObjectStore('orders', { keyPath: 'id' });
          ordersStore.createIndex('tableId', 'tableId', { unique: false });
          ordersStore.createIndex('synced', 'synced', { unique: false });
        }

        // Offline data store (for caching menu, tables, etc.)
        if (!db.objectStoreNames.contains('offlineData')) {
          db.createObjectStore('offlineData', { keyPath: 'key' });
        }

        // Menu images cache
        if (!db.objectStoreNames.contains('images')) {
          const imagesStore = db.createObjectStore('images', { keyPath: 'url' });
          imagesStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
        }
      };
    });
  }

  // Offline order management
  async saveOfflineOrder(tableId: number, orderData: any): Promise<string> {
    const order: OfflineOrder = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tableId,
      data: orderData,
      timestamp: Date.now(),
      synced: false,
    };

    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');
      const request = store.add(order);

      request.onsuccess = () => resolve(order.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getOfflineOrders(): Promise<OfflineOrder[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsyncedOrders(): Promise<OfflineOrder[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction(['orders'], 'readonly');
      const store = transaction.objectStore('orders');
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markOrderSynced(orderId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');
      const getRequest = store.get(orderId);

      getRequest.onsuccess = () => {
        const order = getRequest.result;
        if (order) {
          order.synced = true;
          const putRequest = store.put(order);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject('Order not found');
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async removeOfflineOrder(orderId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction(['orders'], 'readwrite');
      const store = transaction.objectStore('orders');
      const request = store.delete(orderId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Offline data caching
  async cacheData(key: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const offlineData = {
        key,
        data,
        timestamp: Date.now(),
      };

      const transaction = this.db.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.put(offlineData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedData(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Image caching for offline support
  async cacheImage(url: string, blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const imageData = {
        url,
        blob,
        lastAccessed: Date.now(),
      };

      const transaction = this.db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const request = store.put(imageData);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedImage(url: string): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const transaction = this.db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const request = store.get(url);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Update last accessed time
          result.lastAccessed = Date.now();
          store.put(result);
          resolve(result.blob);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Cleanup old cached images
  async cleanupOldImages(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('Database not initialized');

      const cutoff = Date.now() - maxAge;
      const transaction = this.db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      const index = store.index('lastAccessed');
      const request = index.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          if (cursor.value.lastAccessed < cutoff) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Sync utilities
  async getLastSyncTime(): Promise<number> {
    const data = await this.getCachedData('lastSync');
    return data || 0;
  }

  async updateLastSyncTime(): Promise<void> {
    await this.cacheData('lastSync', Date.now());
  }

  async isOnline(): boolean {
    return navigator.onLine;
  }

  // Setup background sync
  async requestBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync-orders');
      } catch (error) {
        console.warn('Background sync not available:', error);
      }
    }
  }
}

// Create singleton instance
export const offlineStorage = new OfflineStorageManager();

// Initialize on app start
export async function initOfflineStorage() {
  try {
    await offlineStorage.init();
    console.log('Offline storage initialized');
  } catch (error) {
    console.error('Failed to initialize offline storage:', error);
  }
}

// Utility function to handle offline-capable API requests
export async function makeOfflineCapableRequest(
  url: string,
  options: RequestInit = {},
  fallbackData?: any
): Promise<any> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    // Cache successful responses
    await offlineStorage.cacheData(`api_${url}`, data);
    return data;
  } catch (error) {
    console.warn('API request failed, trying cache:', error);
    
    // Try to get cached data
    const cachedData = await offlineStorage.getCachedData(`api_${url}`);
    if (cachedData) {
      return { ...cachedData, offline: true };
    }
    
    // Return fallback data if available
    if (fallbackData) {
      return { ...fallbackData, offline: true, fallback: true };
    }
    
    throw error;
  }
}