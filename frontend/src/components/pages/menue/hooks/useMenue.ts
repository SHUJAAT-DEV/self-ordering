import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  Menue,
  Dashboard,
  Menues,
  MenueCategory,
  MenueCategories,
} from "../../../../api/request";
import { notification } from "antd";

const useMenue = ({ menuId }: { menuId?: any }) => {
  const queryClient = useQueryClient();
  var edit = false;
  const setDataValue = (value: any) => {
    edit = value;
  };

  const { data: menueList, isLoading } = useQuery({
    queryKey: ["menue-list"],
    queryFn: async () => {
      const response = await Menue.getAll();
      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });

  // const { data: menueCategoryList } = useQuery({
  //   queryKey: ["menue-category-list"],
  //   queryFn: async () => {
  //     const response = await MenueCategory.getAll();
  //     return response.data;
  //   },
  //   staleTime: 30_000, // cache for 60 seconds
  // });

  const {
    mutate: saveMenu,
    error: creattionError,
    isLoading: isLoadingMenue,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: any) => {
      //console.log("yes", data);
      const { menue, image } = data;

      const formData = new FormData();
      formData.append("id", menuId);
      formData.append("name", menue.name);
      formData.append("price", menue.price);
      formData.append("discount", menue.discount);
      formData.append("isAvailable", menue.isAvailable);
      formData.append("userId", localStorage.userId);
      formData.append("menueCategoryId", menue.menueCategoryId);
      if (image?.file) {
        console.log("image present");
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
        const response = await Menues.updateMenueWithHeader(formData, config);
        return response;
      } else {
        //console.log("new menu");
        const response = await Menues.saveMenueWithImage(formData, config);
        return response;
      }
    },
    onSuccess: (success: any) => {
      //console.log("ss", success);
      queryClient.refetchQueries({
        queryKey: ["menue-list"],
        type: "active",
        exact: true,
      });
      notification.success({
        message: success?.data?.message,
        description: "Add/update Menue",
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
    mutate: deleteMenue,
    error: deleteMenueError,
    isLoading: isLoadingdeleteMenue,
    isSuccess: deleteMenueSuccess,
  } = useMutation({
    mutationFn: async () => {
      const formatData = {
        id: menuId,
      };

      const response = await Menues.deleteMenue(formatData);
      return response;
    },
    onSuccess: (success: any) => {
      //console.log("ss", success);
      queryClient.refetchQueries({
        queryKey: ["menue-list"],
        type: "active",
        exact: true,
      });
      notification.success({
        message: success?.data?.message,
        description: "Delete Menue",
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
    menueList,
    isLoading,
    saveMenu,
    isSuccess,
    isLoadingMenue,
    setIsEdit: setDataValue,
    //menueCategoryList,
    deleteMenue,
    deleteMenueError,
    isLoadingdeleteMenue,
    deleteMenueSuccess,
  };
};

export default useMenue;
