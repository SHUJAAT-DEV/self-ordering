import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  // Customer,
  Dashboard
} from "../../../../api/request";

const useDashboard = () => {
  const queryClient = useQueryClient();
  
  const { data: totalCustomer, isLoading } = useQuery({
    queryKey: ["total-customer"],
    queryFn: async () => {
      const response = await Dashboard.totalCustomers();
      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });

  const { data: totalCredit,isLoading: isCreditLoading } = useQuery({
    queryKey: ["total-credit"],
    queryFn: async () => {
      const response = await Dashboard.totalCredit();
      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });

  const { data: totalDebit, isLoading:isDebitLoading } = useQuery({
    queryKey: ["total-debit"],
    queryFn: async () => {
      const response = await Dashboard.totalDebit();
      return response.data;
    },
    staleTime: 30_000, // cache for 60 seconds
  });
  


  return {
    totalCustomer,
    isLoading,
    totalCredit,
    isCreditLoading,
    totalDebit,
    isDebitLoading
    
  };
};

export default useDashboard;
