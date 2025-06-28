import { Injectable } from "@nestjs/common";
import { CreateExpenseDto } from "./dto/create-expense.dto";
import { UpdateExpenseDto } from "./dto/update-expense.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Expense } from "./entities/expense.entity";
import { Repository } from "typeorm";
import { RESPONSE_MESSAGES } from "@/utils/enums/response.messages.enum";
import { ResponseService } from "@/shared/services/response.service";

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseHeadRepo: Repository<Expense>,
    private readonly responseService: ResponseService
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const newExpHead = new Expense();
    newExpHead.name = createExpenseDto.name;

    const savedData = await this.expenseHeadRepo.save(newExpHead);
    return this.responseService.sendSuccessResponse(
      RESPONSE_MESSAGES.SUCCESS,
      savedData
    );
  }

  async findAll() {
    const result = await this.expenseHeadRepo.find();
    return result;
  }

  async findOne(id: string) {
    const result = await this.expenseHeadRepo.findOne({
      where: [
        {
          id: id,
        },
      ],
    });
    return result;
  }

  async update(updateExpenseDto: CreateExpenseDto) {
    const expHead = await this.expenseHeadRepo.findOne({
      where: [
        {
          id: updateExpenseDto.expenseHeadId,
        },
      ],
    });
    if (expHead) {
      expHead.name = updateExpenseDto.name;
      const updateData = await this.expenseHeadRepo.save(expHead);

      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        updateData
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
