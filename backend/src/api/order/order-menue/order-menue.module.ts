import { Module } from "@nestjs/common";
import { OrderMenueService } from "./order-menue.service";
import { OrderMenueController } from "./order-menue.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderMenue } from "./entities/order-menue.entity";

@Module({
  imports: [TypeOrmModule.forFeature([OrderMenue])],
  controllers: [OrderMenueController],
  providers: [OrderMenueService],
  exports: [OrderMenueService],
})
export class OrderMenueModule {}
