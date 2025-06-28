import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Menue, Order, Orders } from "../../../../api/request";

const useOrderInfo = ({ orderId }: { orderId?: any }) => {
  const queryClient = useQueryClient();
  var edit = false;
  const setDataValue = (value: any) => {
    edit = value;
  };

  const { data: menueList, isLoading } = useQuery({
    queryKey: ["menue-list-screen"],
    queryFn: async () => {
      const response = await Menue.getAll();

      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });

  const {
    mutate: placeOrder,
    error: creattionError,
    data: placedOrderData,
    isLoading: isLoadingOrder,
    isSuccess,
    reset:orderReset,
  } = useMutation({
    mutationFn: async (data: any) => {
      if (edit === true) {
        const response = await Order.create(data);
        return response.data;
      } else {
          const formatedData ={
            orderedMenue: data.orders.map((order:any)=>({
              id: order.item.id,
              name: order.item.name,
              price: order.item.price,
              quantity: order.quantity
            
            })),
            tableNumber: data.tableNumber
          }
        const response = await Order.create(formatedData);
        return response.data?.data?.invoiceNumber;
      }
    }
  });

  const { data: orderStatus } = useQuery({
    queryKey: ["menue-list-screen"],
    queryFn: async () => {
      const response = await Orders.getOrderStatus(orderId);

      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });

  return {
    menueList,
    isLoading,
    placeOrder,
    placedOrderData,
    isSuccess,
    isLoadingOrder,
    orderStatus,
    setIsEdit: setDataValue,
    orderReset
  };
};

export default useOrderInfo;
