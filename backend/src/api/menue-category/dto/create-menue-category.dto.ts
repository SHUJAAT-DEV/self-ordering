export class CreateMenueCategoryDto {
  public userId: string;
  public name: string;
  public isAvailable: any;
  public image: string;
}

export class UpdateMenueCategoryDto {
  public userId: string;
  public id: string;
  public name: string;
  public image: string;
  public isAvailable: any;
}

export class DeleteMenueCategory{
  public id:string;
}
