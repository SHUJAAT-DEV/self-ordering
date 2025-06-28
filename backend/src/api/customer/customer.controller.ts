import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { Express } from "express";
import { diskStorage } from "multer";
import { CustomerService } from "./customer.service";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "./dto/create-customer.dto";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Post("/delete/:customerId")
  deleteCustomer(@Param("customerId") customerId: string) {
    return this.customerService.deleteCustomer(customerId);
  }

  @Get("/search/:name")
  searchByName(@Param("name") name: string) {
    return this.customerService.searchByCustomerName(name);
  }

  @Get("/payment-history/:customerId")
  paymentHistory(@Param("customerId") customerId: string) {
    return this.customerService.getPaymentHistory(customerId);
  }
  @Get("total-customer")
  totalCustomer() {
    
    return this.customerService.totalCustomer();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customerService.findOne(id);
  }

  @Post("update")
  updateTexts(@Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.updateTextData(updateCustomerDto);
  }

  

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.customerService.remove(+id);
  }
}
