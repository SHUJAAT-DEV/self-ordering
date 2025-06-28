import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto, FilterOrdersDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { ORDER_STATUS } from "@/utils/enums/orderStatus.enums";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() args: CreateOrderDto) {
    return this.orderService.create(args);
  }

  @Post("filter-orders")
  filterOrders(@Body() args: FilterOrdersDto) {
    //console.log("yes", args);
    return this.orderService.filterOrders(args);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get("status/:status")
  getByStatus(@Param("status") status: ORDER_STATUS) {
    //console.log("hit ,", status);
    return this.orderService.getOrderStatusByName(status);
  }

  @Get("bill/:orderId")
  getOrderBill(@Param("orderId") orderId: string) {
    return this.orderService.getOrderBill(orderId);
  }

  @Get("get-order-status/:id")
  getOrderStatus(@Param("id") id: string) {
    return this.orderService.getOrderStatus(id);
  }

  @Get("get-current-order-by-table-id/:id")
  getCurrentOrderByTableId(@Param("id") id: string) {
    return this.orderService.getCurrentOrderByTableId(id);
  }

  @Post()
  completeOrder(@Body() args: CreateOrderDto) {
    return this.orderService.create(args);
  }

  @Post("cancel-order/:id")
  cancleOrder(@Param("id") id: string) {
    return this.orderService.cancelOrder(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch("update-order-status/:id")
  updateOrderStatus(@Param("id") id: string, @Body() orderStatus: any) {
    console.log("orderStatus", orderStatus);
    return this.orderService.updateOrderStatus(id, orderStatus.status);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.orderService.remove(+id);
  }
}
