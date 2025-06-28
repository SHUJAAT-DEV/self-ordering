import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  Menue,
  Dashboard,
  Menues,
  MenueCategory,
  MenueCategories,
} from "../../../../api/request";
import { notification } from "antd";

const useMenueCategory = ({ menuCategoryId }: { menuCategoryId?: any }) => {
  const queryClient = useQueryClient();
  var edit = false;
  const setDataValue = (value: any) => {
    edit = value;
  };

  const { data: menueCategoryList, isLoading } = useQuery({
    queryKey: ["menue-category-list"],
    queryFn: async () => {
      const response = await MenueCategory.getAll();
      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });

  const {
    mutate: saveMenuCategory,
    error: creattionError,
    isLoading: isLoadingMenue,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: any) => {
      
      const { menue, image } = data;
      const formData = new FormData();
      formData.append("id", menuCategoryId);
      formData.append("name", menue.name);
      formData.append("isAvailable", menue.isAvailable);
      formData.append("userId", localStorage.userId);
      if (image?.file) {
        
        formData.append("file", image.file);
      }
      //console.log("to send", formData);
      const config = {
        headers: {
          "content-type":
            "multipart/form-data;boundary=----WebKitFormBoundary-signatureImage-",
        },
      };

      if (edit === true) {
        //console.log("edit");
        const response = await MenueCategories.updateMenueCategoryWithHeader(
          formData,
          config
        );
        return response;
      } else {
        //console.log("new menu");
        const response = await MenueCategories.saveMenueCategoryWithImage(
          formData,
          config
        );
        return response;
      }
    },
    onSuccess: (success: any) => {
      //console.log("ss", success);
      queryClient.refetchQueries({
        queryKey: ["menue-category-list"],
        type: "active",
        exact: true,
      });
      notification.success({
        message: success?.data?.message,
        description: "Add/update Menue Category",
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
    mutate: deleteMenueCategory,
    error: deleteMenueCategoryError,
    isLoading: isLoadingdeleteMenueCategory,
    isSuccess: deleteMenueCategorySuccess,
  } = useMutation({
    mutationFn: async () => {
      
      const formatData = {
        id: menuCategoryId,        
      };

      const response = await MenueCategories.deleteMenueCategory(formatData);
      return response;
    },
    onSuccess: (success: any) => {
      //console.log("ss", success);
      queryClient.refetchQueries({
        queryKey: ["menue-category-list"],
        type: "active",
        exact: true,
      });
      notification.success({
        message: success?.data?.message,
        description: "Delete Menue Category",
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
    menueCategoryList,
    isLoading,
    saveMenuCategory,
    isSuccess,
    isLoadingMenue,
    setIsEdit: setDataValue,
    deleteMenueCategory,
    deleteMenueCategoryError,
    isLoadingdeleteMenueCategory,
    deleteMenueCategorySuccess,
  };
};

export default useMenueCategory;
