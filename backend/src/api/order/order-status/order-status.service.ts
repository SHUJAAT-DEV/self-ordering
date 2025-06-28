import { Injectable } from "@nestjs/common";
import { CreateOrderStatusDto } from "./dto/create-order-status.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderStatus } from "./entities/order-status.entity";
import { Repository } from "typeorm";
import { ORDER_STATUS } from "@/utils/enums/orderStatus.enums";

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectRepository(OrderStatus)
    private readonly repository: Repository<OrderStatus>
  ) {}
  create(createOrderStatusDto: CreateOrderStatusDto) {
    return "This action adds a new orderStatus";
  }

  findAll() {
    return `This action returns all orderStatus`;
  }

  async getByName(name: string) {
    const statusName = await this.repository.findOne({
      where: {
        name: name,
      },
    });

    return statusName;
  }

  async getOrderStatus(statusId: any) {
    const status = await this.repository.findOne({
      where: {
        id: statusId.id,
      },
    });
    return status;
  }

  async getOrderStatusByName(name: ORDER_STATUS) {
    const status = await this.repository.findOne({
      where: {
        name: name,
      },
    });
    return status;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderStatus`;
  }

  update(id: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    return `This action updates a #${id} orderStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderStatus`;
  }
}
