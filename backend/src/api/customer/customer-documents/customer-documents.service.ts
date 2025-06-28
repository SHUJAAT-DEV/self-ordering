import { Injectable } from "@nestjs/common";
import { CreateCustomerDocumentDto } from "./dto/create-customer-document.dto";
import { UpdateCustomerDocumentDto } from "./dto/update-customer-document.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerDocument } from "./entities/customer-document.entity";
import { FindOperator, Repository } from "typeorm";
import { ResponseService } from "@/shared/services/response.service";

@Injectable()
export class CustomerDocumentsService {
  constructor(
    @InjectRepository(CustomerDocument)
    private readonly customerDocsRepo: Repository<CustomerDocument>,
    private readonly responseService: ResponseService
  ) {}
  create(createCustomerDocumentDto: CreateCustomerDocumentDto) {
    return "This action adds a new customerDocument";
  }

  async findAll() {
    const result = await this.customerDocsRepo.find();
    return result;
  }

  async getCustomerImages(customerId: string) {
    const images = await this.customerDocsRepo.find({
      where: [
        {
          customerId: new FindOperator("equal", customerId),
        },
      ],
    });
    return images;
  }

  findOne(id: number) {
    return `This action returns a #${id} customerDocument`;
  }

  update(id: number, updateCustomerDocumentDto: UpdateCustomerDocumentDto) {
    return `This action updates a #${id} customerDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} customerDocument`;
  }

  async addCustomerImages(args: CreateCustomerDocumentDto) {
    const addImg = new CustomerDocument();
    addImg.customerId = args.customerId;
    addImg.documentType = args.documentType;
    addImg.imagePath = args.imagePath;
    const savedData = await this.customerDocsRepo.save(addImg);
    return savedData;
  }
}
