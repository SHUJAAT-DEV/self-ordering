import { Module } from "@nestjs/common";
import { TableService } from "./table.service";
import { TableController } from "./table.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Table } from "./entities/table.entity";
import { SharedModule } from "@/shared/shared.module";

@Module({
  imports: [TypeOrmModule.forFeature([Table]), SharedModule],
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {}
