import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CompanyTransactionService } from "./company-transaction.service";

import { UpdateCompanyTransactionDto } from "./dto/update-company-transaction.dto";
import { CreateCompanyTransactionDto } from "./dto/create-company-transaction.dto";
import { addPaymentDto } from "./dto/add-payment.dto";

@Controller("company-transactions")
export class CompanyTransactionController {
  constructor(
    private readonly companyTransactionService: CompanyTransactionService
  ) {}

  @Post()
  create(@Body() createCompanyTransactionDto: CreateCompanyTransactionDto) {
    return this.companyTransactionService.create(createCompanyTransactionDto);
  }

  @Post("/add-payment")
  addPayment(@Body() addPaymentDto: addPaymentDto) {
    return this.companyTransactionService.addPayment(addPaymentDto);
  }

  @Get()
  findAll() {
    return this.companyTransactionService.findAll();
  }

  @Get("total-credit")
  totalCredit() {
    return this.companyTransactionService.totalCredit();
  }

  @Get("total-debit")
  totalDebit() {
    return this.companyTransactionService.totalDebit();
  }

  @Post("/delete/:transactionId")
  deleteTransaction(@Param("transactionId") transactionId: string) {
    return this.companyTransactionService.deleteTransaction(transactionId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.companyTransactionService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCompanyTransactionDto: UpdateCompanyTransactionDto
  ) {
    return this.companyTransactionService.update(
      +id,
      updateCompanyTransactionDto
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.companyTransactionService.remove(+id);
  }
}
