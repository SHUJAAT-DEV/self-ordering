import {
  ClassSerializerInterceptor,
  Controller,
  Req,
  UseGuards,
  UseInterceptors,
  Put,
  Body,
  Inject,
  Post,
  Get,
  Param,
  Patch,
} from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "@/api/user/auth/auth.guard";
import { UpdateNameDto } from "./user.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users")
export class UserController {
  @Inject(UserService)
  private readonly userService: UserService;

  @Put("name")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  private updateName(
    @Body() body: UpdateNameDto,
    @Req() req: Request
  ): Promise<User> {
    return this.userService.updateName(body, req);
  }

  @Post()
  private create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Get()
  private getAll(@Req() req: Request): Promise<User[]> {
    return this.userService.getAll();
  }
  @Patch()
  update(@Body() body: CreateUserDto) {
    return this.userService.update(body);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findUser(id);
  }
}
