import { Injectable } from '@nestjs/common';

@Injectable()
export class SseService {
  private clients = new Set<Function>();

  addClient(client: Function) {
      this.clients.add(client);
      return () => this.clients.delete(client);
  }

  sendEvent(data: any) {
      const eventString = `data: ${JSON.stringify(data)}\n\n`;
      this.clients.forEach(client => client(eventString));
  }
}
