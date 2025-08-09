import { Controller, Get, Req, Res, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { SseService, SSEClient } from './sse.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('sse')
export class SseController {
  constructor(private sseService: SseService) {}

  @Get('events')
  async streamEvents(
    @Req() request: Request,
    @Res() response: Response,
    @Query('role') role?: string,
    @Query('userId') userId?: string,
    @Query('tableId') tableId?: string,
  ): Promise<void> {
    // Set SSE headers
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
      'Access-Control-Allow-Credentials': 'true',
    });

    // Create client
    const client: SSEClient = {
      id: uuidv4(),
      response,
      userId: userId ? parseInt(userId) : undefined,
      role: role || 'guest',
      tableId: tableId ? parseInt(tableId) : undefined,
    };

    // Add client to service
    this.sseService.addClient(client);

    // Keep connection alive with heartbeat
    const heartbeat = setInterval(() => {
      if (response.writable) {
        response.write(': heartbeat\n\n');
      } else {
        clearInterval(heartbeat);
      }
    }, 30000); // 30 seconds

    // Cleanup on disconnect
    response.on('close', () => {
      clearInterval(heartbeat);
      this.sseService.removeClient(client.id);
    });

    response.on('error', () => {
      clearInterval(heartbeat);
      this.sseService.removeClient(client.id);
    });
  }

  @Get('status')
  getStatus(): { clientCount: number; clients: { role: string; count: number }[] } {
    const clientCount = this.sseService.getClientCount();
    
    const roleStats = ['kitchen', 'counter', 'waiter', 'admin', 'guest'].map(role => ({
      role,
      count: this.sseService.getClientsByRole(role).length,
    }));

    return {
      clientCount,
      clients: roleStats,
    };
  }
}