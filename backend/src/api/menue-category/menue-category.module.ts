import { Module } from "@nestjs/common";
import { MenueCategoryService } from "./menue-category.service";

import { MenueCategory } from "./entities/menue-category.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenueCategoryController } from "./menue-category.controller";

@Module({
  imports: [TypeOrmModule.forFeature([MenueCategory])],
  controllers: [MenueCategoryController],
  providers: [MenueCategoryService],
  exports: [MenueCategoryService],
})
export class MenueCategoryModule {}
