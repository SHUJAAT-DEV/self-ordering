import { User } from "@/api/user/entities/user.entity";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginDto } from "./auth.dto";
import { AuthHelper } from "./auth.helper";

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(body: any): Promise<User | never> {
    const { username, password, email, contact, roleId } = body;
    let user: User = await this.repository.findOne({ where: { username } });

    if (user) {
      throw new HttpException("Conflict", HttpStatus.CONFLICT);
    }

    user = new User();

    user.username = username;
    user.email = email;
    user.contact = contact;
    user.password = password;
    user.createdDate = new Date();
    user.roleId = roleId;

    return await this.repository.save(user);
  }

  public async login(body: LoginDto): Promise<string | never> {
    const { username, password }: LoginDto = body;
    const user: User = await this.repository.findOne({ where: { username } });

    if (!user) {
      throw new HttpException("No user found", HttpStatus.NOT_FOUND);
    }

    // const isPasswordValid: boolean = this.helper.isPasswordValid(password, user.password);

    if (user.password !== password) {
      throw new HttpException("No user found", HttpStatus.NOT_FOUND);
    }

    // this.repository.update(user.id, { lastLoginAt: new Date() });

    return this.helper.generateToken(user);
  }

  public async refresh(user: User): Promise<string> {
    // this.repository.update(user.id, { lastLoginAt: new Date() });

    return this.helper.generateToken(user);
  }
}
