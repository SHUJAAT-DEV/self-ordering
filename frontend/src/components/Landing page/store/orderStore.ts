import create from 'zustand';
import { Menue } from '../types/order';

  interface Order {
    item: Menue;
    quantity: number;
  }


  interface OrderStore {
    orders: Order[];
    addOrder: (item: Menue) => void;
    updateOrder: (item: Menue, quantity: number) => void;
    resetOrder: () => void;
  }

  const useOrderStore = create<OrderStore>((set,get) => ({
    orders: [],
    addOrder: (item) => {
      const existingOrder = get().orders.find((order) => order.item.id === item.id);
       if(existingOrder){
       const updatedLis =   get().orders.map((order) => {
            if(order.item.id === item.id){
              return { ...order, quantity: order.quantity + 1};
            }
            return order;
          })
           set(({ orders:updatedLis}));
       }
       else {
      set((state) => ({
        orders: [...state.orders, { item, quantity: 1 }],
      }));
    }
    },
    resetOrder: () => {
      set({ orders: [] });
    },
    updateOrder: (item, quantity) => {
      if(quantity === 0){
        set((state) => {
          const updatedOrders = state.orders.filter((order) => order.item.id !== item.id);
          return { orders: updatedOrders };
        });
        return;
      }else{
        set((state) => {
          const updatedOrders = state.orders.map((order) => {
            if (order.item.id === item.id) {
              return { ...order, quantity };
            }
            return order;
          });
          return { orders: updatedOrders };
        });
      }

    },
  }));

  export default useOrderStore;