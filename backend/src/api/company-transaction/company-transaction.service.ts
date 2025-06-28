import { Injectable } from "@nestjs/common";
import { CreateCompanyTransactionDto } from "./dto/create-company-transaction.dto";
import { UpdateCompanyTransactionDto } from "./dto/update-company-transaction.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CompanyTransaction } from "./entities/company-transaction.entity";
import { ResponseService } from "@/shared/services/response.service";
import { FindOperator, Repository } from "typeorm";
import { addPaymentDto } from "./dto/add-payment.dto";
import { RESPONSE_MESSAGES } from "@/utils/enums/response.messages.enum";

@Injectable()
export class CompanyTransactionService {
  constructor(
    @InjectRepository(CompanyTransaction)
    private readonly companyTransRepo: Repository<CompanyTransaction>,
    private readonly responseService: ResponseService
  ) {}

  create(createCompanyTransactionDto: CreateCompanyTransactionDto) {
    return "This action adds a new companyTransaction";
  }

  async addPayment(args: addPaymentDto) {
    const newTrans = new CompanyTransaction();
    newTrans.transactionType = args.transactionType;
    newTrans.amount = args.amount;
    var balance = 0;
    var prevBalance = 0;
    if (args.transactionType === "credit" && args.customerId !== null) {
      prevBalance = await this.getCustomerBalance(args.customerId);
      balance = Number(prevBalance) + Number(args.amount);
      newTrans.balance = balance;
    } else if (args.transactionType === "debit" && args.customerId !== null) {
      prevBalance = await this.getCustomerBalance(args.customerId);
      balance = Number(prevBalance) - Number(args.amount);
      newTrans.balance = balance;
    } else {
      newTrans.balance = 0;
    }

    newTrans.transactionDate = args.transactionDate ?? new Date();
    newTrans.particulars = args.notes;
    newTrans.createdDate = new Date();
    newTrans.expenseHeadId = args.expenseHeadId ?? null;
    newTrans.customerId = args.customerId ?? null;
    newTrans.userId = args.userId;
    const savedData = await this.companyTransRepo.save(newTrans);
    return this.responseService.sendSuccessResponse(
      RESPONSE_MESSAGES.SUCCESS,
      savedData
    );
  }
  async getCustomerBalance(customerId: string) {
    const result = await this.companyTransRepo.findOne({
      where: {
        customerId: new FindOperator("equal", customerId),
      },
      order: {
        createdDate: "DESC",
      },
    });
    if (result) {
      return result.balance;
    } else {
      return 0;
    }
  }

  async findAll() {
    const result = await this.companyTransRepo.find({
      where: {
        voided: false,
      },
    });
    return result;
  }

  async getCustomerPaymentHistory(customerId: string) {
    const result = await this.companyTransRepo.find({
      where: {
        customerId: new FindOperator("equal", customerId),
      },
      order: {
        createdDate: "ASC",
      },
    });

    if (result.length > 0) {
      return result;
    }
  }

  async findOne(id: string) {
    const transaction = await this.companyTransRepo.findOne({
      where: [
        {
          id: id,
        },
      ],
    });
    if (transaction) {
      return transaction;
    }
  }

  update(id: number, updateCompanyTransactionDto: UpdateCompanyTransactionDto) {
    return `This action updates a #${id} companyTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyTransaction`;
  }

  async totalCredit() {
    const result = await this.companyTransRepo
      .createQueryBuilder("companyTransactions")
      .where("companyTransactions.transaction_type = :transactionTyp", {
        transactionTyp: "credit",
      })
      .select("SUM(companyTransactions.amount)", "sum")
      .getRawOne();

    return result.sum || 0;
  }

  async totalDebit() {
    const result = await this.companyTransRepo
      .createQueryBuilder("companyTransactions")
      .where("companyTransactions.transaction_type = :transactionTyp", {
        transactionTyp: "debit",
      })
      .select("SUM(companyTransactions.amount)", "sum")
      .getRawOne();

    return result.sum || 0;
  }
  async deleteTransaction(transactionId: string) {
    const transaction = await this.companyTransRepo.findOne({
      where: [
        {
          id: transactionId,
        },
      ],
    });
    if (transaction) {
      transaction.voided = true;
      const savedData = await this.companyTransRepo.save(transaction);
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        savedData
      );
    }
  }

  async deleteCustomerTransaction(customerId: string) {
    const transaction = await this.companyTransRepo.find({
      where: [
        {
          customerId: new FindOperator("equal", customerId),
        },
      ],
    });
    if (transaction) {
      transaction.forEach(async (transaction) => {
        transaction.voided = true;
        await this.companyTransRepo.save(transaction);
      });
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS
      );
    }
  }
}
