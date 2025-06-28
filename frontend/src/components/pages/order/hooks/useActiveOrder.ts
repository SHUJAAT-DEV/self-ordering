import { useMutation } from "@tanstack/react-query";
import { Orders } from "../../../../api/request";

const useActiveOrder = () => {
  const {
    mutate: getOrderByStatus,
    error: creattionError,
    isLoading,
    isSuccess,
    data: orderData,
  } = useMutation({
    mutationFn: async (status: string) => {
      const response = await Orders.getOrderBySatatus(status);
      return response.data;
    },
  });

  const {
    mutate: updateOrderStatus,
    error: updateOrderError,
    isLoading: updateOrderLoading,
    data: orderStatusData,
  } = useMutation({
    mutationFn: async (order: any) => {
      const { orderId, status } = order;
      const response = await Orders.updateOrderStatus(orderId, { status });
      return response.data;
    },
  });

  return {
    isSuccess,
    creattionError,
    isLoading,
    orderData,
    getOrderByStatus,

    updateOrderStatus,
    updateOrderError,
    updateOrderLoading,
    orderStatusData,
  };
};

export default useActiveOrder;
