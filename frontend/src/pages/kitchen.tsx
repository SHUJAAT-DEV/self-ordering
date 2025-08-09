import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useSSE } from "@/hooks/use-sse";
import { ConnectionStatus } from "@/components/connection-status";
import { ChefHat, Clock, Play, CheckCircle, AlertCircle } from "lucide-react";
import type { OrderWithItems } from "@/types";

export default function KitchenApp() {
  const { toast } = useToast();

  // SSE for real-time updates
  useSSE("/events", (data) => {
    if (data.type === "order_created" || data.type === "order_updated") {
      queryClient.invalidateQueries({ queryKey: ["/orders"] });
    }
  });

  // Queries
  const { data: pendingOrders = [], isLoading: pendingLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/orders?status=pending"],
  });

  const { data: cookingOrders = [], isLoading: cookingLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/orders?status=cooking"],
  });

  const { data: readyOrders = [], isLoading: readyLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/orders?status=ready"],
  });

  // Mutations
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      return await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/orders"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const startCooking = (orderId: number) => {
    updateOrderStatusMutation.mutate({ orderId, status: "cooking" });
    toast({
      title: "Cooking Started",
      description: "Order has been moved to cooking status.",
    });
  };

  const markReady = (orderId: number) => {
    updateOrderStatusMutation.mutate({ orderId, status: "ready" });
    toast({
      title: "Order Ready",
      description: "Order has been marked as ready for pickup.",
    });
  };

  const formatTime = (date: Date | string | null) => {
    if (!date) return "--:--";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getCookingTime = (startedAt: Date | string | null) => {
    if (!startedAt) return "00:00";
    const start = new Date(startedAt);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="text-warning w-8 h-8 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Kitchen Dashboard</h1>
            </div>
            <ConnectionStatus />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Kitchen Status Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ChefHat className="mr-3 text-warning w-6 h-6" />
              Kitchen Status
            </h2>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {pendingLoading ? "..." : pendingOrders.length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {cookingLoading ? "..." : cookingOrders.length}
                </div>
                <div className="text-sm text-gray-600">Cooking</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {readyLoading ? "..." : readyOrders.length}
                </div>
                <div className="text-sm text-gray-600">Ready</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
              Pending Orders
            </h3>

            {pendingLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-gray-100 rounded-lg loading-pulse" />
                ))}
              </div>
            ) : pendingOrders.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No pending orders</p>
              </Card>
            ) : (
              pendingOrders.map((order) => (
                <Card key={order.id} className="border-l-4 border-warning">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Clock className="text-gray-400 mr-2 w-4 h-4" />
                        <span className="text-sm text-gray-600">
                          {formatTime(order.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{order.table.name}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="text-gray-900">{item.menuItem.name}</span>
                          <Badge variant="secondary">×{item.quantity}</Badge>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => startCooking(order.id)}
                      disabled={updateOrderStatusMutation.isPending}
                      className="w-full"
                    >
                      <Play className="mr-2 w-4 h-4" />
                      Start Cooking
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Cooking Orders */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
              Cooking
            </h3>

            {cookingLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-56 bg-gray-100 rounded-lg loading-pulse" />
                ))}
              </div>
            ) : cookingOrders.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                <ChefHat className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No orders cooking</p>
              </Card>
            ) : (
              cookingOrders.map((order) => (
                <Card key={order.id} className="border-l-4 border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Clock className="text-gray-400 mr-2 w-4 h-4" />
                        <span className="text-sm text-gray-600">
                          {formatTime(order.startedAt)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{order.table.name}</span>
                      </div>
                    </div>

                    {/* Cooking Timer */}
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Cooking Time:</span>
                        <span className="font-mono font-semibold text-primary">
                          {getCookingTime(order.startedAt)}
                        </span>
                      </div>
                      <Progress value={60} className="mt-2" />
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="text-gray-900">{item.menuItem.name}</span>
                          <Badge variant="secondary">×{item.quantity}</Badge>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => markReady(order.id)}
                      disabled={updateOrderStatusMutation.isPending}
                      className="w-full bg-secondary hover:bg-secondary/90"
                    >
                      <CheckCircle className="mr-2 w-4 h-4" />
                      Mark Ready
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Ready Orders */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
              Ready for Pickup
            </h3>

            {readyLoading ? (
              <div className="space-y-4">
                {[...Array(1)].map((_, i) => (
                  <div key={i} className="h-40 bg-gray-100 rounded-lg loading-pulse" />
                ))}
              </div>
            ) : readyOrders.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No ready orders</p>
              </Card>
            ) : (
              readyOrders.map((order) => (
                <Card key={order.id} className="border-l-4 border-secondary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Clock className="text-secondary mr-2 w-4 h-4" />
                        <span className="text-sm text-gray-600">
                          {formatTime(order.readyAt)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{order.table.name}</span>
                      </div>
                    </div>

                    {/* Ready Status */}
                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center">
                        <CheckCircle className="text-secondary mr-2 w-5 h-5" />
                        <span className="text-secondary font-medium">Order Ready!</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Waiting for pickup...</div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="text-gray-900">{item.menuItem.name}</span>
                          <Badge variant="secondary">×{item.quantity}</Badge>
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-sm text-gray-500 flex items-center justify-center">
                      <AlertCircle className="mr-1 w-4 h-4" />
                      Sent to counter for billing
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
