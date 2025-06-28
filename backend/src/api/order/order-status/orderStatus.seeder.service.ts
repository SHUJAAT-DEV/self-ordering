import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { OrderStatus } from "./entities/order-status.entity";

@Injectable()
export class OrderStatusSeederService {
  constructor(
    @InjectRepository(OrderStatus)
    private readonly repository: Repository<OrderStatus>
  ) {}

  async seedOrderStatus(): Promise<void> {
    const existingData = await this.repository.find();

    if (existingData.length === 0) {
      // Seed your initial data here
      const status1 = new OrderStatus();
      status1.id = "247c10af-f0fe-4dd4-8d89-68173c9364a5";
      status1.name = "running";
      await this.repository.save(status1);

      const status2 = new OrderStatus();
      status2.id = "74610b61-67f3-4f5c-ad2d-c470fa2d42dd";
      status2.name = "preparing";
      await this.repository.save(status2);

      const status3 = new OrderStatus();
      status3.id = "df46e491-91a7-40f4-b7a6-8524dc1460e8";
      status3.name = "complete";
      await this.repository.save(status3);

      const status4 = new OrderStatus();
      status4.id = "5c2ffc2f-0902-4d9b-9d5c-4b7e0887c657";
      status4.name = "served";
      await this.repository.save(status4);

      const status5 = new OrderStatus();
      status5.id = "e1593b2a-4d7c-42dc-9996-25d777f3a0d1";
      status5.name = "cancelled";
      await this.repository.save(status5);
    }
  }
}
