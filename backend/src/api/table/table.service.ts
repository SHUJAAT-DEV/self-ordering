import { Injectable } from "@nestjs/common";
import { CreateTableDto, UpdateTableDto } from "./dto/create-table.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Table } from "./entities/table.entity";
import { Repository } from "typeorm";
import { ResponseService } from "@/shared/services/response.service";
import { RESPONSE_MESSAGES } from "@/utils/enums/response.messages.enum";

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private readonly repository: Repository<Table>,
    private readonly responseService: ResponseService
  ) {}
  async create(args: CreateTableDto) {
    const table = new Table();
    table.userId = args.userId;
    table.tableNumber = args.tableNumber;
    table.capacity = args.capacity;
    table.isReserve = args.isReserve;

    const savedData = await this.repository.save(table);
    return this.responseService.sendSuccessResponse(
      RESPONSE_MESSAGES.SUCCESS,
      savedData
    );
  }

  async findAll() {
    const table = await this.repository.find();
    return table;
  }

  async findOne(id: string) {
    const table = await this.repository.findOne({
      where: {
        id: id,
      },
    });

    return table;
  }

  async getTableByNumber(tableNumber: any) {
    const table = await this.repository.findOne({
      where: {
        tableNumber: tableNumber,
      },
    });
    return table;
  }

  async updateTable(args: UpdateTableDto) {
    const table = await this.repository.findOne({
      where: {
        id: args.id,
      },
    });

    if (table) {
      table.tableNumber = args.tableNumber;
      table.capacity = args.capacity;
      table.isReserve = args.isReserve;

      const savedData = await this.repository.save(table);
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        savedData
      );
    }
  }

  update(id: number, updateTableDto: UpdateTableDto) {
    return `This action updates a #${id} table`;
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
  async updateIsReserve(tableId: string, reserve: boolean): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(Table)
      .set({ isReserve: reserve })
      .where("id = :id", { id: tableId })
      .execute();
  }
}
