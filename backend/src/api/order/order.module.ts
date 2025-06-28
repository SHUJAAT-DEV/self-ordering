import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderStatusModule } from "./order-status/order-status.module";
import { OrderMenueModule } from "./order-menue/order-menue.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { SseModule } from "../sse/sse.module";
import { TableModule } from "../table/table.module";

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Order]),
    OrderStatusModule,
    OrderMenueModule,
    SseModule,
    TableModule
  ],
  exports: [OrderService],
})
export class OrderModule {}
