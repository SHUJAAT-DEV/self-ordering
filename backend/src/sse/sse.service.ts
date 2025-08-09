import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';

export interface SSEClient {
  id: string;
  response: Response;
  userId?: number;
  role?: string;
  tableId?: number;
}

export interface OrderUpdateEvent {
  type: 'order.created' | 'order.updated' | 'order.status_changed';
  orderId: number;
  tableId: number;
  status?: string;
  data?: any;
}

export interface KitchenUpdateEvent {
  type: 'kitchen.new_order' | 'kitchen.order_updated' | 'kitchen.order_ready';
  orderId: number;
  orderNumber: string;
  data?: any;
}

export interface CounterUpdateEvent {
  type: 'counter.order_ready' | 'counter.payment_pending';
  orderId: number;
  tableId: number;
  data?: any;
}

@Injectable()
export class SseService {
  private clients = new Map<string, SSEClient>();

  constructor(private eventEmitter: EventEmitter2) {
    this.setupEventListeners();
  }

  addClient(client: SSEClient): void {
    this.clients.set(client.id, client);

    // Send initial connection message
    this.sendToClient(client.id, {
      type: 'connection',
      message: 'Connected to real-time updates',
      timestamp: new Date().toISOString(),
    });

    // Setup cleanup on client disconnect
    client.response.on('close', () => {
      this.removeClient(client.id);
    });

    client.response.on('error', () => {
      this.removeClient(client.id);
    });
  }

  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.response.end();
      this.clients.delete(clientId);
    }
  }

  private sendToClient(clientId: string, data: any): boolean {
    const client = this.clients.get(clientId);
    if (!client) return false;

    try {
      const payload = `data: ${JSON.stringify(data)}\n\n`;
      client.response.write(payload);
      return true;
    } catch (error) {
      console.error(`Error sending to client ${clientId}:`, error);
      this.removeClient(clientId);
      return false;
    }
  }

  private sendToClients(filter: (client: SSEClient) => boolean, data: any): number {
    let sentCount = 0;
    
    this.clients.forEach((client, clientId) => {
      if (filter(client)) {
        if (this.sendToClient(clientId, data)) {
          sentCount++;
        }
      }
    });

    return sentCount;
  }

  // Send to all kitchen clients
  sendToKitchen(data: any): number {
    return this.sendToClients(
      (client) => client.role === 'kitchen',
      data
    );
  }

  // Send to all counter clients
  sendToCounter(data: any): number {
    return this.sendToClients(
      (client) => client.role === 'counter',
      data
    );
  }

  // Send to specific table
  sendToTable(tableId: number, data: any): number {
    return this.sendToClients(
      (client) => client.tableId === tableId,
      data
    );
  }

  // Send to all waiters
  sendToWaiters(data: any): number {
    return this.sendToClients(
      (client) => client.role === 'waiter',
      data
    );
  }

  // Send to all admin clients
  sendToAdmins(data: any): number {
    return this.sendToClients(
      (client) => client.role === 'admin',
      data
    );
  }

  // Send to all clients
  broadcast(data: any): number {
    return this.sendToClients(() => true, data);
  }

  private setupEventListeners(): void {
    // Order events
    this.eventEmitter.on('order.created', (event: OrderUpdateEvent) => {
      this.sendToKitchen({
        type: 'kitchen.new_order',
        ...event,
        timestamp: new Date().toISOString(),
      });

      this.sendToWaiters({
        type: 'order.created',
        ...event,
        timestamp: new Date().toISOString(),
      });

      this.sendToAdmins({
        type: 'order.created',
        ...event,
        timestamp: new Date().toISOString(),
      });
    });

    this.eventEmitter.on('order.status_changed', (event: OrderUpdateEvent) => {
      const { status, orderId, tableId, data } = event;

      // Send to table (if waiter is at the table)
      this.sendToTable(tableId, {
        type: 'order.status_changed',
        orderId,
        status,
        data,
        timestamp: new Date().toISOString(),
      });

      // Send to waiters
      this.sendToWaiters({
        type: 'order.status_changed',
        orderId,
        tableId,
        status,
        data,
        timestamp: new Date().toISOString(),
      });

      // If order is ready, notify counter
      if (status === 'ready') {
        this.sendToCounter({
          type: 'counter.order_ready',
          orderId,
          tableId,
          data,
          timestamp: new Date().toISOString(),
        });
      }

      // Send to admins
      this.sendToAdmins({
        type: 'order.status_changed',
        orderId,
        tableId,
        status,
        data,
        timestamp: new Date().toISOString(),
      });
    });

    this.eventEmitter.on('kitchen.order_ready', (event: KitchenUpdateEvent) => {
      this.sendToCounter({
        type: 'counter.order_ready',
        ...event,
        timestamp: new Date().toISOString(),
      });

      this.sendToWaiters({
        type: 'kitchen.order_ready',
        ...event,
        timestamp: new Date().toISOString(),
      });
    });

    // Menu updates (for offline sync)
    this.eventEmitter.on('menu.updated', (data: any) => {
      this.broadcast({
        type: 'menu.updated',
        data,
        timestamp: new Date().toISOString(),
      });
    });

    // Table status updates
    this.eventEmitter.on('table.status_changed', (data: any) => {
      this.sendToWaiters({
        type: 'table.status_changed',
        data,
        timestamp: new Date().toISOString(),
      });

      this.sendToAdmins({
        type: 'table.status_changed',
        data,
        timestamp: new Date().toISOString(),
      });
    });
  }

  getClientCount(): number {
    return this.clients.size;
  }

  getClientsByRole(role: string): SSEClient[] {
    return Array.from(this.clients.values()).filter(client => client.role === role);
  }
}