import { Trim } from "class-sanitizer";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
  public readonly username: string;

  @IsString()
  @MinLength(8)
  public readonly password: string;

  @IsString()
  @IsOptional()
  public readonly name?: string;
}

export class LoginDto {
  public readonly username: string;

  @IsString()
  public readonly password: string;
}
