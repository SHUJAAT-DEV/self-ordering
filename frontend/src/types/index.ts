export interface BarCodeNumber {
  scanCode: string;
  gameNumber: string;
  packNumber: string;
  packSize: string;
}

export interface LocationData {
  name: string;
  ownerName: string;
  phoneNumber: string;
  numberOfSlot: string;
  email: string;
  city: string;
  address: string;
}

export interface GameData {
  id: string;
  name: string;
  amount: number;
  gameNumber: number;
  numberOfPack: number;
  image: string;
}

export interface InventoryData {
  packNumber: number;
  packSize: number;
  gameNumber: number;
  userId: string;
}

export interface FilterOrderOptions {
  status: string;
  fromDate: string;
  toDate: string;
  userId: string;
}
