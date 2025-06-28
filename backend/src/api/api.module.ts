import { Module } from "@nestjs/common";

import { AuthModule } from "./user/auth/auth.module";

import { MenueCategoryModule } from "./menue-category/menue-category.module";
import { MenueModule } from "./menue/menue.module";
import { OrderStatusModule } from "./order/order-status/order-status.module";
import { OrderModule } from "./order/order.module";
import { SseModule } from "./sse/sse.module";
import { TableModule } from "./table/table.module";
import { PersonModule } from "./user/person/person.module";
import { RoleModule } from "./user/role/role.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    UserModule,
    AuthModule,
    RoleModule,
    PersonModule,
    TableModule,
    MenueModule,
    OrderModule,
    OrderStatusModule,
    SseModule,
    MenueCategoryModule,
  ],
})
export class ApiModule {}
