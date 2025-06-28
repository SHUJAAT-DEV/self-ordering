import { Module } from "@nestjs/common";
import { CompanyTransactionService } from "./company-transaction.service";
import { CompanyTransactionController } from "./company-transaction.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyTransaction } from "./entities/company-transaction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CompanyTransaction])],
  controllers: [CompanyTransactionController],
  providers: [CompanyTransactionService],
  exports: [CompanyTransactionService],
})
export class CompanyTransactionModule {}
