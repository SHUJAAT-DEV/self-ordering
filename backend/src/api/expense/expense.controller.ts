import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";

@Controller("expenses")
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  @Get()
  findAll() {
    return this.expenseService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.expenseService.findOne(id);
  }

  @Post("update")
  update(@Body() updateExpenseDto: CreateExpenseDto) {
    return this.expenseService.update(updateExpenseDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.expenseService.remove(+id);
  }
}
