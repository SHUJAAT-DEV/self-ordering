import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TableService } from "./table.service";
import { CreateTableDto, UpdateTableDto } from "./dto/create-table.dto";

@Controller("table")
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @Get()
  findAll() {
    return this.tableService.findAll();
  }

  @Post("update-table")
  updateTable(@Body() args: UpdateTableDto) {
    // console.log("get here: ", createMenueDto);
    return this.tableService.updateTable(args);
  }

  @Get("get-table/:tableNumber")
  getByTableNumber(@Param("tableNumber") tableNumber: any) {
    return this.tableService.getTableByNumber(tableNumber);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tableService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tableService.remove(+id);
  }
}
