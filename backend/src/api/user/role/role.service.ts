import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>
  ) {}

  async seedRole() {
    const existingRole = await this.repository.find();
    if (existingRole.length === 0) {
      const newRole = new Role();
      newRole.id = "5d22666f-37b2-4696-9701-15cadd75ae78";
      newRole.name = "admin";
      await this.repository.save(newRole);
      //add counter
      const newRole2 = new Role();
      newRole2.id = "68f5895d-369a-4487-90fe-13fca32e9bbb";
      newRole2.name = "counter";
      await this.repository.save(newRole2);
      return newRole;
    }
  }

  create(createRoleDto: CreateRoleDto) {
    return "This action adds a new role";
  }

  async findAll() {
    return await this.repository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
