export class CreateOrderDto {
  orderId?: string;
  tableNumber: string;
  orderedMenue: OrdereMenuList[];
  constructor(
    tableNumber: string,
    orderedMenu: OrdereMenuList[],
    orderId?: string
  ) {
    this.tableNumber = tableNumber;
    this.orderedMenue = orderedMenu;
    this.orderId = orderId;
  }
}

export class OrdereMenuList {
  id: string;
  name: string;
  price: string;
  quantity: string;
  constructor(id: string, name: string, price: string, quantity: string) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
}

import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FilterOrdersDto {
  @IsString()
  fromDate: string;

  @IsString()
  toDate: string;
}
