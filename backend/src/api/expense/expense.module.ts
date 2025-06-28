import { Module } from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { ExpenseController } from "./expense.controller";
import { Expense } from "./entities/expense.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
