import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { AuthModule } from "./auth/auth.module";
import { SeederService } from "./seeder.service";
import { RoleModule } from "./role/role.module";
import { PersonModule } from "./person/person.module";
import { OrderStatusModule } from "../order/order-status/order-status.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    RoleModule,
    PersonModule,
    OrderStatusModule,
  ],
  controllers: [UserController],
  providers: [UserService, SeederService],
  exports: [UserService, SeederService],
})
export class UserModule {}
