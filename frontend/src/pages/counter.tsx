import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useSSE } from "@/hooks/use-sse";
import { ConnectionStatus } from "@/components/connection-status";
import { CreditCard, Printer, Receipt, BarChart3, CheckCircle, History } from "lucide-react";
import type { OrderWithItems, OrderSummary } from "@/types";

export default function CounterApp() {
  const { toast } = useToast();

  // SSE for real-time updates
  useSSE("/events", (data) => {
    if (data.type === "order_updated") {
      queryClient.invalidateQueries({ queryKey: ["/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/analytics"] });
    }
  });

  // Queries
  const { data: readyOrders = [], isLoading: readyLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/orders?status=ready"],
  });

  const { data: recentPayments = [], isLoading: paymentsLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/orders?status=paid"],
  });

  const { data: dailySummary, isLoading: summaryLoading } = useQuery<OrderSummary>({
    queryKey: ["/analytics/daily-summary"],
  });

  // Mutations
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      return await apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/analytics"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const printBill = (order: OrderWithItems) => {
    // Simulate printing - in real implementation, this would use WebUSB or Bluetooth API
    if (window.print) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${order.table.name}</title>
              <style>
                body { font-family: monospace; font-size: 12px; margin: 20px; }
                .header { text-align: center; margin-bottom: 20px; }
                .items { margin: 20px 0; }
                .item { display: flex; justify-content: space-between; margin: 5px 0; }
                .total { border-top: 1px solid #000; margin-top: 10px; padding-top: 10px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>Restaurant Receipt</h2>
                <p>${order.table.name}</p>
                <p>${new Date().toLocaleString()}</p>
              </div>
              <div class="items">
                ${order.items.map(item => `
                  <div class="item">
                    <span>${item.menuItem.name} x${item.quantity}</span>
                    <span>$${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                `).join('')}
              </div>
              <div class="total">
                <div class="item">
                  <span>Subtotal:</span>
                  <span>$${order.subtotal}</span>
                </div>
                <div class="item">
                  <span>Tax:</span>
                  <span>$${order.tax}</span>
                </div>
                <div class="item" style="font-weight: bold;">
                  <span>Total:</span>
                  <span>$${order.total}</span>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }

    toast({
      title: "Receipt Printed",
      description: `Receipt for ${order.table.name} has been printed.`,
    });
  };

  const markPaid = (orderId: number, tableName: string) => {
    updateOrderStatusMutation.mutate({ orderId, status: "paid" });
    toast({
      title: "Payment Processed",
      description: `Payment for ${tableName} has been marked as completed.`,
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

  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CreditCard className="text-primary w-8 h-8 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Counter & Billing</h1>
            </div>
            <ConnectionStatus />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Counter Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <CreditCard className="mr-3 text-primary w-6 h-6" />
              Counter Status
            </h2>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  {readyLoading ? "..." : readyOrders.length}
                </div>
                <div className="text-sm text-gray-600">Ready for Billing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {summaryLoading ? "..." : `$${dailySummary?.totalRevenue || "0"}`}
                </div>
                <div className="text-sm text-gray-600">Today's Sales</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ready Orders for Billing */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Receipt className="mr-2 text-secondary w-5 h-5" />
                Ready for Billing
              </h3>

              {readyLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-lg loading-pulse" />
                  ))}
                </div>
              ) : readyOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No orders ready for billing</p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {readyOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-green-200 rounded-lg p-4 bg-green-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Receipt className="text-secondary mr-2 w-4 h-4" />
                            <span className="font-semibold text-gray-900">
                              {order.table.name}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span>{formatTime(order.readyAt)}</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2 mb-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                              <div>
                                <span className="text-gray-900">{item.menuItem.name}</span>
                                <span className="text-gray-500 ml-2">×{item.quantity}</span>
                              </div>
                              <span className="font-medium text-gray-900">
                                ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Bill Total */}
                        <Separator className="my-3" />
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>${order.subtotal}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tax (8.5%):</span>
                            <span>${order.tax}</span>
                          </div>
                          <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total:</span>
                            <span>${order.total}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-4">
                          <Button
                            onClick={() => printBill(order)}
                            className="flex-1"
                            variant="outline"
                          >
                            <Printer className="mr-2 w-4 h-4" />
                            Print Bill
                          </Button>
                          <Button
                            onClick={() => markPaid(order.id, order.table.name)}
                            disabled={updateOrderStatusMutation.isPending}
                            className="flex-1 bg-secondary hover:bg-secondary/90"
                          >
                            <CreditCard className="mr-2 w-4 h-4" />
                            Mark Paid
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </Card>
          </div>

          {/* Payment History & Analytics */}
          <div className="space-y-6">
            {/* Recent Payments */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <History className="mr-2 text-primary w-5 h-5" />
                Recent Payments
              </h3>

              {paymentsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg loading-pulse" />
                  ))}
                </div>
              ) : recentPayments.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <History className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No recent payments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPayments.slice(0, 5).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="text-secondary mr-3 w-5 h-5" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {payment.table.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatTime(payment.paidAt)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ${payment.total}
                        </div>
                        <div className="text-sm text-secondary">Paid</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Daily Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="mr-2 text-primary w-5 h-5" />
                Daily Summary
              </h3>

              {summaryLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg loading-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {dailySummary?.ordersCompleted || 0}
                    </div>
                    <div className="text-sm text-gray-600">Orders Completed</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">
                      ${dailySummary?.totalRevenue || "0.00"}
                    </div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-warning">
                      ${dailySummary?.averageOrderValue || "0.00"}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Order Value</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {dailySummary?.tablesServed || 0}
                    </div>
                    <div className="text-sm text-gray-600">Tables Served</div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
