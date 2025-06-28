import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { Menue, Menues, TableAPIs, TableApi } from "../../../../api/request";

const useTable = ({ tableId }: { tableId?: any }) => {
  const queryClient = useQueryClient();
  var edit = false;
  const setDataValue = (value: any) => {
    edit = value;
  };

  const { data: tableList, isLoading } = useQuery({
    queryKey: ["table-list"],
    queryFn: async () => {
      const response = await TableApi.getAll();
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
        id: tableId,
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

  return {
    tableList,
    isLoading,
    saveTable,
    isSuccess,
    isLoadingTable,
    setIsEdit: setDataValue,
  };
};

export default useTable;
