import { Injectable } from "@nestjs/common";
import {
  CreateMenueCategoryDto,
  DeleteMenueCategory,
  UpdateMenueCategoryDto,
} from "./dto/create-menue-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MenueCategory } from "./entities/menue-category.entity";
import { Repository } from "typeorm";
import { ResponseService } from "@/shared/services/response.service";
import { RESPONSE_MESSAGES } from "@/utils/enums/response.messages.enum";

@Injectable()
export class MenueCategoryService {
  constructor(
    @InjectRepository(MenueCategory)
    private readonly repository: Repository<MenueCategory>,
    private readonly responseService: ResponseService
  ) {}
  async create(args: CreateMenueCategoryDto) {
    const menuCategory = new MenueCategory();
    menuCategory.name = args.name;
    menuCategory.isAvailable = args.isAvailable === "true" ? true : false;
    menuCategory.image = args.image ? args.image : null;
    const savedData = await this.repository.save(menuCategory);
    return this.responseService.sendSuccessResponse(
      RESPONSE_MESSAGES.SUCCESS,
      savedData
    );
  }

  async updateMenueCategory(args: UpdateMenueCategoryDto) {
    const menuCat = await this.repository.findOne({
      where: {
        id: args.id,
      },
    });

    if (menuCat) {
      menuCat.name = args.name;
      menuCat.isAvailable = args.isAvailable === "true" ? true : false;
      menuCat.image = args.image ?? args.image;

      const savedData = await this.repository.save(menuCat);
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        savedData
      );
    }
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    const menueCat = await this.repository.findOne({
      where: {
        id: id,
      },
    });
    return menueCat;
  }

  update(id: number, updateMenueCategoryDto: UpdateMenueCategoryDto) {
    return `This action updates a #${id} menueCategory`;
  }

  async deleteMenuCategory(args: DeleteMenueCategory) {
    var result=await this.repository.findOne({where:{
      id:args.id
    }})
    if(result){
      const savedData = await this.repository.remove(result);
      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        savedData
      );
    }
  }
}
