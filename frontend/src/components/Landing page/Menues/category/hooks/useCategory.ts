import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

import { notification } from "antd";
import { AnyKindOfDictionary } from "lodash";
import { MenueCategory } from "../../../../../api/request";

const useCategory = ({ categoryId }: { categoryId?: any }) => {
  const queryClient = useQueryClient();
  var edit = false;
  const setDataValue = (value: any) => {
    edit = value;
  };

  const { data: menueCategoryList } = useQuery({
    queryKey: ["menue-list-screen2"],
    queryFn: async () => {
      const response = await MenueCategory.getAll();

      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });

  return {
    setIsEdit: setDataValue,
    menueCategoryList,
  };
};

export default useCategory;
