import { Injectable } from "@nestjs/common";
import { CreateOrderMenueDto } from "./dto/create-order-menue.dto";
import { UpdateOrderMenueDto } from "./dto/update-order-menue.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderMenue } from "./entities/order-menue.entity";
import { FindOperator, Repository } from "typeorm";

@Injectable()
export class OrderMenueService {
  constructor(
    @InjectRepository(OrderMenue)
    private readonly repository: Repository<OrderMenue>
  ) {}

  async pushData(args: any) {
    const data = new OrderMenue();
    data.menueId = args.menuId;
    data.quantity = args.quantity;
    data.orderId = args.orderId;
    await this.repository.save(data);
  }

  async create(args: CreateOrderMenueDto) {
    const data = args.orderedMenue.map((menu) => {
      if (menu.id && menu.quantity && args.orderId) {
        return {
          menueId: menu.id,
          quantity: menu.quantity,
          orderId: args.orderId,
        };
      }
    });

    await this.repository.save(data);
  }

  async deleteAllMenuOrder(orderId: string) {
    await this.repository.delete({ orderId });
  }

  async findAlltheMenuAgainstOrderId(orderId: string) {
    const orderMenus = await this.repository.find({
      where: {
        orderId: new FindOperator("equal", orderId),
      },
      relations: ["menueId"],
    });

    return orderMenus;
  }

  async mergeOrder(orderId1: string, orderId2: string) {
    return await this.repository
      .createQueryBuilder()
      .update(OrderMenue)
      .set({ orderId: orderId1 })
      .where("orderId = :orderId", { orderId: orderId2 })
      .execute();
  }
}
