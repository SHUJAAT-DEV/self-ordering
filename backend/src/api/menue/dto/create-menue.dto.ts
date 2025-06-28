export class CreateMenueDto {
  public userId: string;
  public name: string;
  public price: string;
  public discount: string;
  public isAvailable: any;
  public image: string;
  public menueCategoryId: string;
}

export class UpdateMenueDto {
  public userId: string;
  public id: string;
  public name: string;
  public price: string;
  public discount: string;
  public image: string;
  public isAvailable: any;
  public menueCategoryId: string;
}
export class DeleteMenue {
  public id: string;
}
