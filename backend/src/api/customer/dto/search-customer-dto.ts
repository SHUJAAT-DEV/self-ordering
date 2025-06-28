export class SearchCustomerDto {
  customerList: CustomerListDto[];
}

export class CustomerListDto {
  label: string;
  value: string;
  id: string;
}
