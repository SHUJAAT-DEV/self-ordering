import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";

import { ResponseService } from "@/shared/services/response.service";
import { RESPONSE_MESSAGES } from "@/utils/enums/response.messages.enum";
import { User } from "@/api/user/entities/user.entity";
import { Person } from "./person/entities/person.entity";
import { PersonService } from "./person/person.service";
import { RoleService } from "./role/role.service";

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly personService: PersonService,
    private readonly roleService: RoleService
  ) {}

  async seedUserIfNotExists(): Promise<void> {
    const existingData = await this.userRepository.find();

    if (existingData.length === 0) {
      // Seed your initial data here
      const NewUser = new User();
      NewUser.id = "7ab1a612-5a77-4662-8637-ec229d62c33e";
      NewUser.username = "admin";
      // NewUser.email = "info@trango.com";
      NewUser.password = "admin";
      // Set other properties as needed

      //const newPerson = await this.personService.seedPerson();
      // console.log("newsperson ", newPerson);
      // NewUser.personId = newPerson?.id;

      const newRole = await this.roleService.seedRole();
      NewUser.roleId = newRole?.id;
      await this.userRepository.save(NewUser);
    }
  }
}
