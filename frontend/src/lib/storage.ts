interface StorageData {
  [key: string]: any;
}

export class LocalStorage {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Failed to store item with key "${key}":`, error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const serializedValue = this.storage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error(`Failed to retrieve item with key "${key}":`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item with key "${key}":`, error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  }

  // Offline queue management
  addToOfflineQueue(action: string, data: any): void {
    const queue = this.getItem<any[]>("offline_queue") || [];
    queue.push({
      id: Date.now().toString(),
      action,
      data,
      timestamp: new Date().toISOString(),
    });
    this.setItem("offline_queue", queue);
  }

  getOfflineQueue(): any[] {
    return this.getItem<any[]>("offline_queue") || [];
  }

  clearOfflineQueue(): void {
    this.removeItem("offline_queue");
  }

  removeFromOfflineQueue(id: string): void {
    const queue = this.getOfflineQueue();
    const filteredQueue = queue.filter((item) => item.id !== id);
    this.setItem("offline_queue", filteredQueue);
  }

  // Order drafts management
  saveDraftOrder(tableId: number, orderData: any): void {
    const drafts = this.getItem<Record<number, any>>("order_drafts") || {};
    drafts[tableId] = {
      ...orderData,
      lastModified: new Date().toISOString(),
    };
    this.setItem("order_drafts", drafts);
  }

  getDraftOrder(tableId: number): any | null {
    const drafts = this.getItem<Record<number, any>>("order_drafts") || {};
    return drafts[tableId] || null;
  }

  removeDraftOrder(tableId: number): void {
    const drafts = this.getItem<Record<number, any>>("order_drafts") || {};
    delete drafts[tableId];
    this.setItem("order_drafts", drafts);
  }

  getAllDraftOrders(): Record<number, any> {
    return this.getItem<Record<number, any>>("order_drafts") || {};
  }
}

export const localStorage = new LocalStorage();
