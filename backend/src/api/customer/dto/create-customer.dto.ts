export class CreateCustomerDto {
  name: string;
  email: string;
  contact: string;
  address: string;
  documents: any[];
}

export class UpdateCustomerDto {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
}
