export class CreateUserDto {
  public userId: string;
  public username: string;
  public email: string;
  public password: string;
  public contact: string;
  public roleId: string;
}

export class UpdateUserDto {
  public userId: string;
  public username: string;
  public email: string;
  public password: string;
  public contact: string;
  public roleId: string;
}
