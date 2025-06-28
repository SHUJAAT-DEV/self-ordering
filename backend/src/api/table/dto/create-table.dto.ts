export class CreateTableDto {
  userId: string;
  tableNumber: string;
  capacity: Number;
  isReserve: boolean;
}

export class UpdateTableDto {
  id: string;
  userId: string;
  tableNumber: string;
  capacity: Number;
  isReserve: boolean;
}
