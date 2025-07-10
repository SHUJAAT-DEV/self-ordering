export interface SSEMessage {
  type: string;
  [key: string]: any;
}

export class SSEClient {
  private eventSource: EventSource | null = null;
  private listeners: ((data: SSEMessage) => void)[] = [];
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 10;
  private reconnectAttempts: number = 0;
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    try {
      this.eventSource = new EventSource(this.url);

      this.eventSource.onopen = () => {
        console.log("SSE connection opened");
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as SSEMessage;
          this.listeners.forEach((listener) => listener(data));
        } catch (error) {
          console.error("Failed to parse SSE message:", error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        this.eventSource?.close();
        this.eventSource = null;
        this.handleReconnect();
      };
    } catch (error) {
      console.error("Failed to create SSE connection:", error);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect SSE (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error("Max reconnect attempts reached for SSE");
    }
  }

  addListener(listener: (data: SSEMessage) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (data: SSEMessage) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.listeners = [];
  }

  getReadyState(): number {
    return this.eventSource?.readyState ?? EventSource.CLOSED;
  }

  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}
