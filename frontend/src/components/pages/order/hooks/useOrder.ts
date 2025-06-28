import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import {
  Menue,
  Menues,
  Order,
  Orders,
  TableAPIs,
  TableApi,
} from "../../../../api/request";
import { FilterOrderOptions } from "../../../../types";

const useOrder = ({ orderId }: { orderId?: any }) => {
  const queryClient = useQueryClient();
  var edit = false;
  const setDataValue = (value: any) => {
    edit = value;
  };

  const { data: orderList, isLoading } = useQuery({
    queryKey: ["order-list"],
    queryFn: async () => {
      const response = await Order.getAll();
      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });

  const {
    mutate: saveTable,
    error: creattionError,
    isLoading: isLoadingTable,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: any) => {
      const formatData = {
        id: orderId,
        tableNumber: data.tableNumber,
        capacity: data.capacity,
        isReserve: data.isReserve,
        userId: localStorage.userId,
      };

      if (edit === true) {
        const response = await TableAPIs.updateTalbe(formatData);
        return response;
      } else {
        const response = await TableApi.create(formatData);
        return response;
      }
    },
    onSuccess: (success: any) => {
      //console.log("ss", success);
      queryClient.refetchQueries({
        queryKey: ["table-list"],
        type: "active",
        exact: true,
      });
      notification.success({
        message: success?.data?.message,
        description: "Add/update Table",
      });
    },
    onError(error: any) {
      notification.error({
        message: error?.response?.data?.message,
        description: "Something went wrong",
      });
      return error?.response?.data?.erroMessage;
    },
  });

  const {
    mutate: getOrderBill,
    error: getOrderBillError,
    isLoading: getOrderLoading,
    isSuccess: getOrderBillSuccess,
    data: orderBillData,
  } = useMutation({
    mutationFn: async (id: string) => {
      const response = await Orders.getOrderBill(id);
      console.log("bill", response.data);
      return response.data;
    },
  });

  const {
    mutate: filterOrders,
    isLoading: filterOrdersLoading,
    data: filteredOrders,
    // error: creattionError,
    // isSuccess,
  } = useMutation<any, Error, any>({
    mutationFn: async (args: FilterOrderOptions) => {
      const response = await Orders.getFilteredOrderList(args);
      console.log("get data is: ", response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["order-list2"],
        type: "active",
        exact: true,
      });
    },
  });

  return {
    orderList,
    isLoading,
    saveTable,
    isSuccess,
    isLoadingTable,
    setIsEdit: setDataValue,
    getOrderBill,
    orderBillData,
    getOrderLoading,
    getOrderBillSuccess,
    filterOrders,
    filteredOrders,
  };
};

export default useOrder;
