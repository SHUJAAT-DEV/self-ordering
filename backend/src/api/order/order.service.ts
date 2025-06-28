import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto, FilterOrdersDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { FindOperator, Not, Repository } from "typeorm";
import { ResponseService } from "@/shared/services/response.service";
import { RESPONSE_MESSAGES } from "@/utils/enums/response.messages.enum";
import { OrderMenueService } from "./order-menue/order-menue.service";
import { CreateOrderMenueDto } from "./order-menue/dto/create-order-menue.dto";
import { OrderStatusService } from "./order-status/order-status.service";
import { SseService } from "../sse/sse.service";
import { ORDER_STATUS } from "@/utils/enums/orderStatus.enums";
import { TableService } from "../table/table.service";
import moment from "moment";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    // private readonly orderMenuRepository: Repository<OrderMenue>,
    private readonly orderedMenueService: OrderMenueService,
    private readonly orderStatusService: OrderStatusService,
    private readonly responseService: ResponseService,
    private readonly sseService: SseService,
    private readonly tableService: TableService
  ) {}

  calculateTotalAmount(orderedMenue: CreateOrderDto["orderedMenue"]) {
    return orderedMenue.reduce((acc, curr) => {
      return acc + parseInt(curr.price) * parseInt(curr.quantity);
    }, 0);
  }

  async create(args: CreateOrderDto) {
    if (!args.orderId) {
      const order = new Order();
      order.orderDate = new Date();
      try {
        const tableDetails = await this.tableService.getTableByNumber(
          args.tableNumber
        );
        order.tableId = tableDetails.id;
        await this.tableService.updateIsReserve(tableDetails.id, true);
      } catch (e) {
        throw new NotFoundException(
          `Table with Number ${args.tableNumber} not found`
        );
      }
      const totalAmount = this.calculateTotalAmount(args.orderedMenue);
      order.total = String(totalAmount);
      order.discount = "0";
      order.orderStatusId = (
        await this.orderStatusService.getByName(ORDER_STATUS.RUNNING)
      )?.id;

      order.invoiceNumber = String(Math.floor(10000 + Math.random() * 90000));

      const savedData = await this.repository.save(order);
      const toSend: CreateOrderMenueDto = {
        orderId: savedData.id,
        orderedMenue: args.orderedMenue,
      };

      const saveMenuList = this.orderedMenueService.create(toSend);
      this.sseService.sendEvent(toSend);
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        savedData
      );
    } else {
      const order = await this.repository.findOne({
        where: { id: args.orderId },
      });
      if (order) {
        const totalAmount = this.calculateTotalAmount(args.orderedMenue);
        order.total = String(totalAmount);
        order.discount = "0";
        order.orderStatusId = (
          await this.orderStatusService.getByName("running")
        )?.id;

        const savedData = await this.repository.save(order);
        const toSend: CreateOrderMenueDto = {
          orderId: savedData.id,
          orderedMenue: args.orderedMenue,
        };
        const deleteMenuList = this.orderedMenueService.deleteAllMenuOrder(
          args.orderId
        );
        const saveMenuList = this.orderedMenueService.create(toSend);
        return this.responseService.sendSuccessResponse(
          RESPONSE_MESSAGES.SUCCESS,
          savedData
        );
      }
    }
  }

  async findAll() {
    const getStatus = await this.orderStatusService.getOrderStatusByName(
      ORDER_STATUS.COMPLETE
    );
    const orders = await this.repository.find({
      where: {
        orderStatusId: new FindOperator("equal", getStatus.id),
      },
    });
    return orders;
  }
  async getOrderStatus(orderId: string) {
    const order = await this.repository.findOne({
      where: {
        id: orderId,
      },
    });

    const status = await this.orderStatusService.getOrderStatus(
      order.orderStatusId
    );

    return status.name;
  }
  async getOrderStatusByName(status: ORDER_STATUS) {
    const getStatus = await this.orderStatusService.getOrderStatusByName(
      status
    );

    const orders = await this.repository.find({
      where: {
        orderStatusId: new FindOperator("equal", getStatus.id),
      },
      relations: ["tableId"],
    });
    return await Promise.all(
      orders.map(async (order) => {
        const orderMenu =
          await this.orderedMenueService.findAlltheMenuAgainstOrderId(order.id);
        return {
          id: order.id,
          table: order.tableId,
          orderNumber: order.invoiceNumber,
          menus: orderMenu,
        };
      })
    );
  }

  async getOrderBill(orderId: string) {
    const order = await this.repository.findOne({
      where: {
        id: orderId,
      },
      relations: ["tableId"],
    });
    const orderMenu =
      await this.orderedMenueService.findAlltheMenuAgainstOrderId(order.id);
    return {
      id: order.id,
      orderDate: order?.orderDate,
      table: order.tableId,
      orderNumber: order.invoiceNumber,
      menus: orderMenu,
    };
  }

  async updateOrderStatus(orderId: string, orderStatus: ORDER_STATUS) {
    // Fetch the order by ID
    const order = await this.repository.findOne({
      where: { id: orderId },
    });

    // Check if the order exists
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Fetch the table ID associated with the order
    const { table_id } = await this.repository
      .createQueryBuilder("order")
      .select("order.tableId")
      .where("order.id = :id", { id: orderId })
      .getRawOne();

    // Get the "SERVED" order status
    const servedStatus = await this.orderStatusService.getOrderStatusByName(
      ORDER_STATUS.SERVED
    );
    console.log("new orders", table_id, orderStatus);

    // Find the status by name
    const status = await this.orderStatusService.getOrderStatusByName(
      orderStatus
    );
    if (!status) {
      throw new NotFoundException(`Status with name ${orderStatus} not found`);
    }

    // Update the order status ID
    order.orderStatusId = status.id;
    const result = await this.repository.save(order);

    // release table
    if (orderStatus === ORDER_STATUS.COMPLETE) {
      await this.tableService.updateIsReserve(table_id, false);
    }
    console.log(
      "compltet",
      orderStatus,
      ORDER_STATUS.COMPLETE,
      orderStatus === ORDER_STATUS.COMPLETE
    );

    // Fetch all orders for the same table with the "SERVED" status
    const currentOrders = await this.repository
      .createQueryBuilder("order")
      .where("order.tableId = :tableId", { tableId: table_id })
      .andWhere("order.orderStatusId = :orderStatusId", {
        orderStatusId: servedStatus.id,
      })
      .getMany();

    // Merge orders if there are multiple orders for the same table with the same status
    if (currentOrders.length > 1) {
      const mergedOrder = await this.orderedMenueService.mergeOrder(
        currentOrders[0].id,
        currentOrders[1].id
      );
      console.log(
        "before",
        currentOrders,
        currentOrders[0].id,
        currentOrders[1].id
      );

      const updatedPrice =
        parseFloat(currentOrders[0].total) + parseFloat(currentOrders[1].total);
      console.log("tot", updatedPrice);
      await this.repository
        .createQueryBuilder()
        .update(Order)
        .set({ total: updatedPrice.toString() })
        .where("id = :id", { id: currentOrders[0].id })
        .execute();

      // Delete the duplicate order
      await this.repository
        .createQueryBuilder()
        .delete()
        .from(Order)
        .where("id = :id", { id: currentOrders[1].id })
        .execute();

      console.log(
        "after",
        currentOrders,
        currentOrders[0].id,
        currentOrders[1].id
      );
    }

    // Send an event with the updated order
    this.sseService.sendEvent(result);
    return result;
  }

  async filterOrders(args: FilterOrdersDto) {
    if (args.fromDate !== "" && args.toDate !== "") {
      var fromDate = new Date(args.fromDate);
      var toDate = new Date(args.toDate);
      const getStatus = await this.orderStatusService.getOrderStatusByName(
        ORDER_STATUS.COMPLETE
      );
      var orders = await this.repository.find({
        where: [
          {
            orderStatusId: new FindOperator("equal", getStatus.id),
          },
        ],
      });
      orders = orders.filter(
        (inv) => inv.orderDate >= fromDate && inv.orderDate <= toDate
      );
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        orders
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async getCurrentOrderByTableId(table_id: string) {
    // Retrieve the status with the name 'COMPLETE'
    //console.log("tableID", table_id);
    const status = await this.orderStatusService.getOrderStatusByName(
      ORDER_STATUS.COMPLETE
    );
    //console.log("status", status.id);

    // Check if the status is retrieved successfully
    if (!status) {
      throw new Error('Status "COMPLETE" not found');
    }

    const orders = await this.repository.find({
      where: {
        tableId: new FindOperator("equal", table_id),
        orderStatusId: new FindOperator("not", status.id),
      },
    });

    const result = await Promise.all(
      orders.map(async (order) => {
        const orderMenu =
          await this.orderedMenueService.findAlltheMenuAgainstOrderId(order.id);
        return {
          id: order.id,
          table: order.tableId,
          orderNumber: order.invoiceNumber,
          menus: orderMenu,
          orderStatus: order.orderStatusId,
        };
      })
    );

    // Send an event with the updated order
    this.sseService.sendEvent(result);
    return result;
  }
  async cancelOrder(id: string) {
    const order = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    if (order) {
      const orderStatus = await this.orderStatusService.getOrderStatusByName(
        ORDER_STATUS.CANCELLED
      );
      order.orderStatusId = orderStatus.id;
      await this.repository.save(order);
      this.sseService.sendEvent(order);
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        order
      );
    }
  }
}
