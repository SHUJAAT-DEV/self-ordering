import { Module } from "@nestjs/common";
import { CustomerDocumentsService } from "./customer-documents.service";
import { CustomerDocumentsController } from "./customer-documents.controller";
import { CustomerDocument } from "./entities/customer-document.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CustomerDocument])],
  controllers: [CustomerDocumentsController],
  providers: [CustomerDocumentsService],
  exports: [CustomerDocumentsService],
})
export class CustomerDocumentsModule {}
