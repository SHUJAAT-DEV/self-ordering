import { Injectable } from "@nestjs/common";
import { CreatePersonDto } from "./dto/create-person.dto";
import { UpdatePersonDto } from "./dto/update-person.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Person } from "./entities/person.entity";
import { Repository } from "typeorm";

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly repository: Repository<Person>
  ) {}

  async seedPerson() {
    console.log("yesss");
    const existingPerson = await this.repository.find();
    if (existingPerson.length === 0) {
      const newPerson = new Person();
      newPerson.firstName = "admin";
      const addedPerson = await this.repository.save(newPerson);
      console.log("created", newPerson);
      return addedPerson;
    }
  }

  create(createPersonDto: CreatePersonDto) {
    return "This action adds a new person";
  }

  findAll() {
    return `This action returns all person`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person`;
  }

  update(id: number, updatePersonDto: UpdatePersonDto) {
    return `This action updates a #${id} person`;
  }

  remove(id: number) {
    return `This action removes a #${id} person`;
  }
}
