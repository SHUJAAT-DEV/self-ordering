import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MenueCategories,
  MenueCategory,
  Order,
  Orders
} from "../../../../api/request";

const useMenueScreen = ({
  tableNumber,
  categoryId,
  tableId,
}: {
  tableNumber?: any;
  categoryId?: any;
  tableId?: any;
}) => {
  const queryClient = useQueryClient();
  var edit = false;
  const setDataValue = (value: any) => {
    edit = value;
  };

  const { data: menueList, isLoading } = useQuery({
    queryKey: ["category-menue-list", categoryId],
    queryFn: async () => {
      if (categoryId) {
        const response = await MenueCategories.getMenueByCategoryId(categoryId);
        const menues = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
        }));

        return menues;
      }

    },
    staleTime: 30_000, // cache for 60 seconds
  });

  const { data: menueCategoryList, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["menue-list-screen2"],
    queryFn: async () => {
      const response = await MenueCategory.getAll();

      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });



  const {
    mutate: getCurrentOrderByTableId,
    isLoading: isLoadingOrder,
    isSuccess,
    data: currentOrder,
  } = useMutation({
    mutationFn: async (tableId: string) => {
      const response = await Orders.getCurrentOrderByTableId(tableId);
      return response.data;
    },
  });

  return {
    menueList,
    isLoading,
    setIsEdit: setDataValue,

    menueCategoryList,
    isLoadingCategory,
    getCurrentOrderByTableId,
    currentOrder,
    isLoadingOrder
  };
};

export default useMenueScreen;
