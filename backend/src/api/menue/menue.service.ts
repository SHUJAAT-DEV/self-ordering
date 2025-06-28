import { ResponseService } from "@/shared/services/response.service";
import { RESPONSE_MESSAGES } from "@/utils/enums/response.messages.enum";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOperator, Repository } from "typeorm";
import {
  CreateMenueDto,
  DeleteMenue,
  UpdateMenueDto,
} from "./dto/create-menue.dto";
import { Menue } from "./entities/menue.entity";

@Injectable()
export class MenueService {
  constructor(
    @InjectRepository(Menue)
    private readonly repository: Repository<Menue>,
    private readonly responseService: ResponseService
  ) {}
  async create(args: CreateMenueDto) {
    const menu = new Menue();
    menu.name = args.name;
    menu.price = args.price;
    menu.discount = args.discount;
    menu.isAvailable = args.isAvailable === "true" ? true : false;
    menu.userId = args.userId;
    menu.image = args.image ? args.image : null;
    menu.menueCategoryId = args.menueCategoryId;
    const savedData = await this.repository.save(menu);
    return this.responseService.sendSuccessResponse(
      RESPONSE_MESSAGES.SUCCESS,
      savedData
    );
  }

  async updateMenue(args: UpdateMenueDto) {
    const menu = await this.repository.findOne({
      where: {
        id: args.id,
      },
    });

    if (menu) {
      menu.name = args.name;
      menu.price = args.price;
      menu.discount = args.discount;
      menu.isAvailable = args.isAvailable === "true" ? true : false;
      menu.image = args.image ?? args.image;
      menu.menueCategoryId = args.menueCategoryId;

      const savedData = await this.repository.save(menu);
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        savedData
      );
    }
  }

  async findAll() {
    const menue = await this.repository.find();
    return menue;
  }

  async findOne(id: string) {
    const menue = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    return menue;
  }

  async getByCategoryId(categoryId: string) {
    const menue = await this.repository.find({
      where: {
        menueCategoryId: new FindOperator("equal", categoryId),
      },
    });
    return menue;
  }

  update(id: number, updateMenueDto: UpdateMenueDto) {
    return `This action updates a #${id} menue`;
  }

  async deleteMenue(args: DeleteMenue) {
    var result = await this.repository.findOne({
      where: {
        id: args.id,
      },
    });
    if (result) {
      const savedData = await this.repository.remove(result);
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        savedData
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} menue`;
  }
}
