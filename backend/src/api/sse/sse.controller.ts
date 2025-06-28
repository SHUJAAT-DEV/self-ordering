import { Controller, Sse, Res, Req, MessageEvent, Get } from '@nestjs/common';
import { Observable, Subscriber } from 'rxjs';
import { SseService } from './sse.service';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('stream')
    stream(): Observable<MessageEvent> {
        return new Observable(subscriber => {
            const client = (data: string) => subscriber.next({ data });
            const removeClient = this.sseService.addClient(client);
            return () => {
                removeClient();
                subscriber.complete();
            };
        });
    }
    @Get()
    findAll() {
      return {};
    }
}
