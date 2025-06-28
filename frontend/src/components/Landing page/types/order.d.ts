export interface Category {
    id:number,
    name: string;
    image: string;
  }
  
  export interface Menue {
    id: number;
    name: string;
    categories: string;
    image: string;
    price: number;
    description: string;
  
  }