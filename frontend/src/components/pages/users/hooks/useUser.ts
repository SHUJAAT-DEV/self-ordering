import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Role, User } from "../../../../api/request";
import { notification } from "antd";

const useUser = ({ userId }: { userId?: any }) => {
  const queryClient = useQueryClient();
  var edit = false;
  var username = "";
  const { data: userList, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await User.getAll();
      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });
  const setDataValue = (value: any) => {
    edit = value;
  };
  const setUsername = (value: any) => {
    username = value;
  };

  const { data: roleList, isLoading: roleListIsLoading } = useQuery({
    queryKey: ["role"],
    queryFn: async () => {
      const response = await Role.getAll();
      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });

  const {
    mutate: saveUser,
    error: creattionError,
    isLoading: isLoadingUser,
    isSuccess,
  } = useMutation({
    mutationFn: async (user: any) => {
      const formatData = {
        userId: userId,
        username: user.username,
        email: user.email,
        password: user.password,
        contact: user.contact,
        roleId: user.roleId,
      };
      if (edit === true) {
        const response = await User.updatePatchNoId(formatData);
        return response;
      } else {
        const response = await User.create(formatData);
        return response;
      }
    },
    onSuccess: (success: any) => {
      console.log("ss", success);
      queryClient.refetchQueries({
        queryKey: ["users"],
        type: "active",
        exact: true,
      });
      notification.success({
        message: success?.data?.message,
        description: "Add/update User",
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
    userList,
    saveUser,
    creattionError,
    isLoading,
    isSuccess,
    roleList,
    roleListIsLoading,
    username: setUsername,
    setIsEdit: setDataValue,
    isLoadingUser,
  };
};

export default useUser;
