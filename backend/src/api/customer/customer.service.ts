import { Injectable } from "@nestjs/common";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "./dto/create-customer.dto";

import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "./entities/customer.entity";
import { Repository } from "typeorm";
import { ResponseService } from "@/shared/services/response.service";
import { RESPONSE_MESSAGES } from "@/utils/enums/response.messages.enum";
import { SearchCustomerDto } from "./dto/search-customer-dto";
import { CustomerDocumentsService } from "./customer-documents/customer-documents.service";
import { CreateCustomerDocumentDto } from "./customer-documents/dto/create-customer-document.dto";
import { CompanyTransactionService } from "../company-transaction/company-transaction.service";

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly responseService: ResponseService,
    private readonly custDocsService: CustomerDocumentsService,
    private readonly compTransService: CompanyTransactionService
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = new Customer();
    customer.name = createCustomerDto.name;
    customer.email = createCustomerDto.email;
    customer.contact = createCustomerDto.contact;
    customer.address = createCustomerDto.address;

    const savedData = await this.customerRepository.save(customer);

    if (createCustomerDto.documents.length > 0) {
      for (let i = 0; i < createCustomerDto.documents.length; i++) {
        const send = {
          customerId: savedData.id,
          documentType: createCustomerDto.documents[i].name,
          imagePath: createCustomerDto.documents[i].path,
        };
        const addImg = await this.custDocsService.addCustomerImages(send);
      }
    }
    return this.responseService.sendSuccessResponse(
      RESPONSE_MESSAGES.SUCCESS,
      savedData
    );
  }

  async createWithImage(createCustomerDto: CreateCustomerDto) {
    const customer = new Customer();
    customer.name = createCustomerDto.name;
    customer.email = createCustomerDto.email;
    customer.contact = createCustomerDto.contact;
    customer.address = createCustomerDto.address;

    const savedData = await this.customerRepository.save(customer);

    if (createCustomerDto.documents.length > 0) {
      for (let i = 0; i < createCustomerDto.documents.length; i++) {
        const send = {
          customerId: savedData.id,
          documentType: createCustomerDto.documents[i].name,
          imagePath: createCustomerDto.documents[i].path,
        };
        const addImg = await this.custDocsService.addCustomerImages(send);
      }
    }

    return this.responseService.sendSuccessResponse(
      RESPONSE_MESSAGES.SUCCESS,
      savedData
    );
  }

  async findAll() {
    const customers = await this.customerRepository.find({
      where: [
        {
          voided: false,
        },
      ],
    });
    return customers;
  }

  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({
      where: [
        {
          id: id,
        },
      ],
    });
    if (customer) {
      return customer;
    }
  }

  async searchByCustomerName(name: string) {
    const customers = await this.customerRepository
      .createQueryBuilder("item")
      .where("item.name ILIKE :searchTerm", { searchTerm: `%${name}%` })
      .andWhere("item.voided = :voided", { voided: false })
      .getMany();
    if (customers.length > 0) {
      const custList = new SearchCustomerDto();
      custList.customerList = customers?.map((item) => ({
        label: item.name,
        value: item.name,
        id: item.id,
      }));
      return custList?.customerList;
    }
  }

  async getPaymentHistory(customerId: string) {
    const payments = await this.compTransService.getCustomerPaymentHistory(
      customerId
    );
    return payments;
  }

  async updateTextData(args: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: [
        {
          id: args.id,
        },
      ],
    });
    if (customer) {
      customer.name = args.name;
      customer.email = args.email;
      customer.contact = args.contact;
      customer.address = args.address;

      const savedData = await this.customerRepository.save(customer);

      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        savedData
      );
    }
  }

  async deleteCustomer(customerrId: string) {
    const customer = await this.customerRepository.findOne({
      where: [
        {
          id: customerrId,
        },
      ],
    });
    if (customer) {
      customer.voided = true;
      const savedData = await this.customerRepository.save(customer);
      this.compTransService.deleteCustomerTransaction(customerrId);
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        savedData
      );
    }
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  async totalCustomer() {
    const customer = await this.customerRepository.find();
    if (customer.length > 0) {
      return customer.length;
    } else {
      return 0;
    }
  }
}
