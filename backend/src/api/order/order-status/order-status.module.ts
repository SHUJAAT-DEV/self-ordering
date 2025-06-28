import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderStatus } from "./entities/order-status.entity";
import { OrderStatusController } from "./order-status.controller";
import { OrderStatusService } from "./order-status.service";
import { OrderStatusSeederService } from "./orderStatus.seeder.service";

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatus])],
  controllers: [OrderStatusController],
  providers: [OrderStatusService, OrderStatusSeederService],
  exports: [OrderStatusService, OrderStatusSeederService],
})
export class OrderStatusModule {}
