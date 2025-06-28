import { Module } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { CustomerController } from "./customer.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "./entities/customer.entity";
import { CustomerDocumentsModule } from "./customer-documents/customer-documents.module";
import { CompanyTransactionModule } from "../company-transaction/company-transaction.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    CustomerDocumentsModule,
    CompanyTransactionModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
