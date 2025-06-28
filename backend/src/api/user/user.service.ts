import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "express";
import { UpdateNameDto } from "./user.dto";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthService } from "./auth/auth.service";
import { ResponseService } from "@/shared/services/response.service";
import { RESPONSE_MESSAGES } from "@/utils/enums/response.messages.enum";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly responseService: ResponseService
  ) {}

  public async updateName(body: UpdateNameDto, req: Request): Promise<User> {
    const user: User = <User>req.user;
    return this.userRepository.save(user);
  }

  public async create(createUserDto: CreateUserDto) {
    const registerUser = this.userRepository.create({
      ...createUserDto,
    });

    const newUser = await this.authService.register(registerUser);

    const savedData = await this.userRepository.save(newUser);
    return this.responseService.sendSuccessResponse(
      RESPONSE_MESSAGES.SUCCESS,
      savedData
    );
  }

  public async update(args: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: [
        {
          id: args.userId,
        },
      ],
    });
    if (user) {
      user.email = args.email;
      user.password = args.password;
      user.contact = args.contact;
      user.roleId = args.roleId;

      const updateUser = await this.userRepository.save(user);

      return this.responseService.sendSuccessResponse(
        RESPONSE_MESSAGES.SUCCESS,
        updateUser
      );
    }
  }

  public findById(id: string) {
    return this.userRepository.findOne({
      where: {
        username: id,
      },
    });
  }

  public findUser(id: string) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  public getAll() {
    return this.userRepository.find();
  }
}
