import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useSSE } from "@/hooks/use-sse";
import { ConnectionStatus } from "@/components/connection-status";
import { TableCard } from "@/components/table-card";
import { MenuItem as MenuItemComponent } from "@/components/menu-item";
import { 
  HandPlatter, 
  ShoppingCart, 
  Send, 
  Save, 
  Plus, 
  Minus, 
  X, 
  ChevronLeft,
  Package
} from "lucide-react";
import type { Table, MenuItem, OrderWithItems } from "@/types";

interface OrderItem {
  menuItemId: number;
  menuItem: MenuItem;
  quantity: number;
  price: string;
}

interface CurrentOrder {
  tableId: number;
  tableName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  existingOrderId?: number; // For editing existing orders
}

type FlowStep = 'tables' | 'orders' | 'categories' | 'subcategories' | 'items';

interface NavigationState {
  step: FlowStep;
  selectedTable: Table | null;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
}

export default function WaiterApp() {
  const [navigation, setNavigation] = useState<NavigationState>({
    step: 'tables',
    selectedTable: null,
    selectedCategory: null,
    selectedSubcategory: null,
  });
  const [currentOrder, setCurrentOrder] = useState<CurrentOrder | null>(null);
  const { toast } = useToast();

  // SSE for real-time updates - temporarily disabled for debugging
  // useSSE("/events", (data) => {
  //   if (data.type === "table_updated" || data.type === "order_updated" || data.type === "order_created") {
  //     queryClient.invalidateQueries({ queryKey: ["/tables"] });
  //     queryClient.invalidateQueries({ queryKey: ["/orders"] });
  //   }
  // });

  // Queries
  const { 
    data: tables = [], 
    isLoading: tablesLoading, 
    error: tablesError,
    isSuccess: tablesSuccess,
    isFetching: tablesFetching 
  } = useQuery<Table[]>({
    queryKey: ["/tables"],
    staleTime: 0, // Force fresh fetch
    refetchOnWindowFocus: true,
    retry: 1,
  });

  console.log("=== TABLES QUERY DEBUG ===");
  console.log("tables data:", tables);
  console.log("tables loading:", tablesLoading);
  console.log("tables fetching:", tablesFetching);
  console.log("tables success:", tablesSuccess);
  console.log("tables error:", tablesError);
  console.log("query key:", ["/tables"]);
  console.log("data type:", typeof tables);
  console.log("data is array:", Array.isArray(tables));
  console.log("data length:", tables?.length);
  console.log("=========================");

  const { data: menuItems = [], isLoading: menuLoading } = useQuery<MenuItem[]>({
    queryKey: ["/menu-items"],
  });

  // Mutations
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", "/api/orders", orderData);
    },
    onSuccess: () => {
      toast({
        title: "Order Submitted",
        description: "Order has been sent to the kitchen successfully.",
      });
      setCurrentOrder(null);
      setNavigation({
        step: 'tables',
        selectedTable: null,
        selectedCategory: null,
        selectedSubcategory: null,
      });
      // Force refresh of tables and orders data
      queryClient.invalidateQueries({ queryKey: ["/tables"] });
      queryClient.invalidateQueries({ queryKey: ["/orders"] });
      queryClient.refetchQueries({ queryKey: ["/tables"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createOrderItemMutation = useMutation({
    mutationFn: async ({ orderId, itemData }: { orderId: number; itemData: any }) => {
      return await apiRequest("POST", `/api/orders/${orderId}/items`, itemData);
    },
  });

  // Derived data
  const categories = Array.from(new Set(menuItems.map(item => item.category)));
  
  const subcategories = navigation.selectedCategory 
    ? Array.from(new Set(
        menuItems
          .filter(item => item.category === navigation.selectedCategory)
          .map(item => item.subcategory)
          .filter((subcategory): subcategory is string => Boolean(subcategory))
      ))
    : [];

  const filteredMenuItems = menuItems.filter(item => {
    if (!navigation.selectedCategory) return false;
    if (item.category !== navigation.selectedCategory) return false;
    if (subcategories.length > 0 && navigation.selectedSubcategory) {
      return item.subcategory === navigation.selectedSubcategory;
    }
    if (subcategories.length > 0 && !navigation.selectedSubcategory) {
      return false; // Must select subcategory if they exist
    }
    return true;
  });

  // Query for existing orders when table is selected
  const { data: tableOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: [`/orders?tableId=${navigation.selectedTable?.id}`],
    enabled: !!navigation.selectedTable,
  });

  // Get active (non-completed) orders for the selected table
  const activeOrders = tableOrders.filter((order: any) => 
    order.status !== 'completed' && order.status !== 'paid'
  );

  // Navigation functions
  const selectTable = (table: Table) => {
    setNavigation(prev => ({
      ...prev,
      step: table.status === 'available' ? 'categories' : 'orders',
      selectedTable: table,
    }));

    if (table.status === "available") {
      // Create new order for available table
      setCurrentOrder({
        tableId: table.id,
        tableName: table.name,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      });
    } else {
      // Table is occupied, will show existing orders
      setCurrentOrder(null);
    }
  };

  const selectCategory = (category: string) => {
    const categorySubcategories = Array.from(new Set(
      menuItems
        .filter(item => item.category === category)
        .map(item => item.subcategory)
        .filter(Boolean)
    ));

    setNavigation(prev => ({
      ...prev,
      step: categorySubcategories.length > 0 ? 'subcategories' : 'items',
      selectedCategory: category,
      selectedSubcategory: null,
    }));
  };

  const selectSubcategory = (subcategory: string) => {
    setNavigation(prev => ({
      ...prev,
      step: 'items',
      selectedSubcategory: subcategory,
    }));
  };

  const goBack = () => {
    if (navigation.step === 'items' && subcategories.length > 0) {
      setNavigation(prev => ({
        ...prev,
        step: 'subcategories',
        selectedSubcategory: null,
      }));
    } else if (navigation.step === 'items' || navigation.step === 'subcategories') {
      setNavigation(prev => ({
        ...prev,
        step: 'categories',
        selectedCategory: null,
        selectedSubcategory: null,
      }));
    } else if (navigation.step === 'categories') {
      // Go back to orders if table is occupied, otherwise to tables
      const backStep = navigation.selectedTable?.status === 'available' ? 'tables' : 'orders';
      setNavigation(prev => ({
        ...prev,
        step: backStep,
        selectedCategory: null,
        selectedSubcategory: null,
      }));
      if (backStep === 'tables') {
        setCurrentOrder(null);
      }
    } else if (navigation.step === 'orders') {
      setNavigation({
        step: 'tables',
        selectedTable: null,
        selectedCategory: null,
        selectedSubcategory: null,
      });
      setCurrentOrder(null);
    }
  };

  // Order management functions
  const createNewOrder = () => {
    if (!navigation.selectedTable) return;
    
    setNavigation(prev => ({
      ...prev,
      step: 'categories',
    }));
    setCurrentOrder({
      tableId: navigation.selectedTable.id,
      tableName: navigation.selectedTable.name,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
    });
  };

  const editExistingOrder = (order: any) => {
    if (!navigation.selectedTable) return;

    // Convert existing order to editable format
    const orderItems = order.items.map((item: any) => ({
      menuItemId: item.menuItem.id,
      menuItem: item.menuItem,
      quantity: item.quantity,
      price: item.price,
    }));

    const subtotal = orderItems.reduce(
      (sum: number, item: any) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const tax = subtotal * 0.085;
    const total = subtotal + tax;

    setCurrentOrder({
      tableId: navigation.selectedTable.id,
      tableName: navigation.selectedTable.name,
      items: orderItems,
      subtotal,
      tax,
      total,
      existingOrderId: order.id as number, // Track that this is editing an existing order
    });

    setNavigation(prev => ({
      ...prev,
      step: 'categories',
    }));
  };

  // Order management functions
  const addItemToOrder = (menuItem: MenuItem) => {
    if (!currentOrder) return;

    const existingItemIndex = currentOrder.items.findIndex(
      (item) => item.menuItemId === menuItem.id
    );

    let newItems;
    if (existingItemIndex >= 0) {
      newItems = [...currentOrder.items];
      newItems[existingItemIndex].quantity += 1;
    } else {
      newItems = [
        ...currentOrder.items,
        {
          menuItemId: menuItem.id,
          menuItem,
          quantity: 1,
          price: menuItem.price,
        },
      ];
    }

    updateOrderTotals(newItems);
  };

  const updateItemQuantity = (menuItemId: number, delta: number) => {
    if (!currentOrder) return;

    const newItems = currentOrder.items
      .map((item) => {
        if (item.menuItemId === menuItemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      })
      .filter(Boolean) as OrderItem[];

    updateOrderTotals(newItems);
  };

  const removeItemFromOrder = (menuItemId: number) => {
    if (!currentOrder) return;

    const newItems = currentOrder.items.filter(
      (item) => item.menuItemId !== menuItemId
    );
    updateOrderTotals(newItems);
  };

  const updateOrderTotals = (items: OrderItem[]) => {
    if (!currentOrder) return;

    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const tax = subtotal * 0.085; // 8.5% tax
    const total = subtotal + tax;

    setCurrentOrder({
      ...currentOrder,
      items,
      subtotal,
      tax,
      total,
    });
  };

  const submitOrder = async () => {
    if (!currentOrder || currentOrder.items.length === 0) return;

    const orderData = {
      tableId: currentOrder.tableId,
      subtotal: currentOrder.subtotal.toFixed(2),
      tax: currentOrder.tax.toFixed(2),
      total: currentOrder.total.toFixed(2),
      status: "pending",
    };

    try {
      if (currentOrder.existingOrderId) {
        // Editing existing order - add new items only
        const response = await apiRequest('GET', `/api/orders/${currentOrder.existingOrderId}`);
        const existingOrder = await response.json();
        
        // Find new items that weren't in the original order
        const existingItemIds = existingOrder.items?.map((item: any) => item.menuItem.id) || [];
        const newItems = currentOrder.items.filter(item => 
          !existingItemIds.includes(item.menuItemId)
        );

        // Add only new items
        for (const item of newItems) {
          await createOrderItemMutation.mutateAsync({
            orderId: currentOrder.existingOrderId,
            itemData: {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: item.price,
              status: "pending",
            },
          });
        }

        toast({
          title: "Order Updated",
          description: `Added ${newItems.length} new items to existing order.`,
        });
      } else {
        // Creating new order
        const response = await createOrderMutation.mutateAsync(orderData);
        const order = await response.json();

        // Add order items
        for (const item of currentOrder.items) {
          await createOrderItemMutation.mutateAsync({
            orderId: order.id,
            itemData: {
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: item.price,
              status: "pending",
            },
          });
        }
      }

      // Refresh orders data
      queryClient.invalidateQueries({ queryKey: ['/orders'] });
    } catch (error) {
      console.error("Failed to submit order:", error);
    }
  };

  // Render functions
  const renderHeader = () => (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {navigation.step !== 'tables' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="mr-3"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <HandPlatter className="text-primary w-8 h-8 mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Waiter App</h1>
              {navigation.selectedTable && (
                <p className="text-sm text-gray-500">
                  {navigation.selectedTable.name} • {getStepTitle()}
                </p>
              )}
            </div>
          </div>
          <ConnectionStatus />
        </div>
      </div>
    </header>
  );

  const getStepTitle = () => {
    switch (navigation.step) {
      case 'tables': return 'Select Table';
      case 'orders': return 'Manage Orders';
      case 'categories': return 'Select Category';
      case 'subcategories': return 'Select Subcategory';
      case 'items': return 'Menu Items';
      default: return '';
    }
  };

  const renderOrderSummaryCard = () => {
    if (!currentOrder || navigation.step === 'tables') return null;

    return (
      <div className="sticky top-20 z-40 mb-6">
        <Card className="bg-white shadow-lg border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <ShoppingCart className="mr-2 w-5 h-5" />
                Order Summary
              </CardTitle>
              <Badge variant="outline">{currentOrder.tableName}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {currentOrder.items.length === 0 ? (
              <p className="text-center text-gray-500 py-2">No items added yet</p>
            ) : (
              <>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {currentOrder.items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between items-center text-sm">
                      <span>{item.quantity}x {item.menuItem.name}</span>
                      <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total:</span>
                  <span className="text-primary">${currentOrder.total.toFixed(2)}</span>
                </div>
                <Button
                  onClick={submitOrder}
                  disabled={createOrderMutation.isPending}
                  className="w-full mt-3 bg-secondary hover:bg-secondary/90"
                  size="sm"
                >
                  <Send className="mr-2 w-4 h-4" />
                  {createOrderMutation.isPending ? "Sending..." : "Send to Kitchen"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTablesScreen = () => (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <HandPlatter className="mr-3 w-6 h-6" />
          Select a Table
        </h2>
        {tablesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => (
              <TableCard
                key={table.id}
                table={table}
                isSelected={false}
                onSelect={selectTable}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const renderCategoriesScreen = () => (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Package className="mr-3 w-6 h-6" />
          Select Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              size="lg"
              onClick={() => selectCategory(category)}
              className="h-24 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
            >
              {category}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderOrdersScreen = () => (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <ShoppingCart className="mr-3 w-6 h-6" />
          {navigation.selectedTable?.name} - Current Orders
        </h2>
        
        {ordersLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* New Order Button */}
            <Button
              onClick={createNewOrder}
              className="w-full h-16 text-lg font-medium bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 w-5 h-5" />
              Create New Order
            </Button>
            
            {/* Existing Orders */}
            {activeOrders.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Active Orders</h3>
                {activeOrders.map((order: any) => (
                  <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            order.status === 'pending' ? 'default' :
                            order.status === 'cooking' ? 'secondary' :
                            order.status === 'ready' ? 'destructive' : 'outline'
                          }>
                            {order.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Order #{order.id}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          {order.items?.slice(0, 3).map((item: any, index: number) => (
                            <div key={index} className="text-sm text-gray-600">
                              {item.quantity}x {item.menuItem.name}
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{order.items.length - 3} more items
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 font-semibold text-primary">
                          Total: ${order.total}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => editExistingOrder(order)}
                          disabled={order.status === 'ready'}
                        >
                          {order.status === 'pending' ? 'Edit Order' : 'Add Items'}
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // View order details functionality can be added here
                              toast({
                                title: "Order Details",
                                description: `Order #${order.id} details displayed.`
                              });
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {activeOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No active orders for this table</p>
                <p className="text-sm">Create a new order to get started</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );

  const renderSubcategoriesScreen = () => (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Package className="mr-3 w-6 h-6" />
          Select Subcategory
        </h2>
        <p className="text-gray-600 mb-4">Category: {navigation.selectedCategory}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subcategories.map((subcategory) => (
            <Button
              key={subcategory}
              variant="outline"
              size="lg"
              onClick={() => selectSubcategory(subcategory)}
              className="h-24 text-lg font-medium hover:bg-primary hover:text-primary-foreground"
            >
              {subcategory}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderItemsScreen = () => (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu Items */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="mr-3 w-6 h-6" />
            Menu Items
          </h2>
          <div className="mb-4 text-sm text-gray-600">
            {navigation.selectedCategory}
            {navigation.selectedSubcategory && ` • ${navigation.selectedSubcategory}`}
          </div>
          
          <ScrollArea className="h-96">
            {menuLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMenuItems.map((item) => (
                  <MenuItemComponent
                    key={item.id}
                    item={item}
                    onAdd={addItemToOrder}
                    disabled={!currentOrder}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>

      {/* Detailed Order Summary */}
      <div className="lg:col-span-1">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="mr-2 w-5 h-5" />
              Order Details
            </h2>
            {currentOrder && (
              <Badge variant="outline">{currentOrder.tableName}</Badge>
            )}
          </div>

          {!currentOrder ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No order in progress</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-64">
                {currentOrder.items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No items added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentOrder.items.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.menuItem.name}
                          </h4>
                          <p className="text-primary font-semibold">
                            ${item.price}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemQuantity(item.menuItemId, -1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemQuantity(item.menuItemId, 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeItemFromOrder(item.menuItemId)}
                            className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${currentOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax (8.5%):</span>
                  <span className="font-medium">${currentOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>${currentOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <Button
                  onClick={submitOrder}
                  disabled={currentOrder.items.length === 0 || createOrderMutation.isPending}
                  className="w-full bg-secondary hover:bg-secondary/90"
                >
                  <Send className="mr-2 w-4 h-4" />
                  {createOrderMutation.isPending ? "Sending..." : "Send to Kitchen"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    toast({
                      title: "Draft Saved",
                      description: "Order draft has been saved locally.",
                    });
                  }}
                >
                  <Save className="mr-2 w-4 h-4" />
                  Save Draft
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral">
      {renderHeader()}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderOrderSummaryCard()}
        
        {navigation.step === 'tables' && renderTablesScreen()}
        {navigation.step === 'orders' && renderOrdersScreen()}
        {navigation.step === 'categories' && renderCategoriesScreen()}
        {navigation.step === 'subcategories' && renderSubcategoriesScreen()}
        {navigation.step === 'items' && renderItemsScreen()}
      </div>
    </div>
  );
}