import { CompanyTransaction } from "@/api/company-transaction/entities/company-transaction.entity";
import { CustomerDocument } from "@/api/customer/customer-documents/entities/customer-document.entity";
import { Customer } from "@/api/customer/entities/customer.entity";
import { Expense } from "@/api/expense/entities/expense.entity";
import { MenueCategory } from "@/api/menue-category/entities/menue-category.entity";
import { Menue } from "@/api/menue/entities/menue.entity";
import { Order } from "@/api/order/entities/order.entity";
import { OrderMenue } from "@/api/order/order-menue/entities/order-menue.entity";
import { OrderStatus } from "@/api/order/order-status/entities/order-status.entity";
import { Table } from "@/api/table/entities/table.entity";
import { User } from "@/api/user/entities/user.entity";
import { Person } from "@/api/user/person/entities/person.entity";
import { Role } from "@/api/user/role/entities/role.entity";

import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.config.get<string>("DATABASE_HOST"),
      port: this.config.get<number>("DATABASE_PORT"),
      database: this.config.get<string>("DATABASE_NAME"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      entities: [
        User,
        Role,
        Person,
        Table,
        Menue,
        Order,
        OrderStatus,
        OrderMenue,
        MenueCategory,
      ],
      migrations: ["dist/migrations/*.{ts,js}"],
      migrationsTableName: "typeorm_migrations",
      logger: "file",
      synchronize: true, // never use TRUE in production!
    };
  }
}
