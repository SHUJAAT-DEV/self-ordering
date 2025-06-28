import { Module } from "@nestjs/common";
import { MenueService } from "./menue.service";
import { MenueController } from "./menue.controller";
import { Menue } from "./entities/menue.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Menue])],
  controllers: [MenueController],
  providers: [MenueService],
  exports: [MenueService],
})
export class MenueModule {}
