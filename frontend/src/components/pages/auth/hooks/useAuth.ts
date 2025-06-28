/* eslint-disable @typescript-eslint/naming-convention */
import { useMutation } from "@tanstack/react-query";
import { Auth } from "../../../../api/request";
import { AuthPropreties } from "../types";
import { useState } from "react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import authUser from "../../../../utils/authUser";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();

  const {
    mutate: login,
    error: loginError,
    isSuccess: loginSuccess,
    isLoading: isLoggingIn,
  } = useMutation({
    mutationFn: async ({ username, password }: AuthPropreties) => {
      const response = await Auth.login({ username, password });

      const token_data: string = JSON.stringify(response);

      const decode_token: any = jwtDecode(token_data);
      localStorage.setItem("userId", decode_token.userId);
      localStorage.setItem("userName", decode_token.userName);
      authUser.setJWTToken(token_data);
      return response?.data;
    },
    onSuccess() {
      navigate("/users");
    },
  });

  return {
    login,
    loginError,
    loginSuccess,
    isLoggingIn,
  };
};

export default useAuth;
