import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { adminApi, authApi, isAuthenticated } from '@/lib/api';
import { config } from '@/lib/config';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Clock,
  ChefHat,
  CreditCard,
  AlertCircle,
  BarChart3,
  Settings,
  LogOut,
  TableIcon,
  UserCheck
} from 'lucide-react';

interface DashboardData {
  overview: {
    totalTables: number;
    availableTables: number;
    occupiedTables: number;
    totalCustomers: number;
    totalStaff: number;
    totalProducts: number;
  };
  todayStats: {
    totalOrders: number;
    completedOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    status: string;
    total: number;
    table: { name: string };
    customer?: { name: string };
    createdAt: string;
  }>;
  topProducts: Array<{
    productName: string;
    orderCount: number;
    revenue: number;
  }>;
  customerStats: {
    newCustomers: number;
    returningCustomers: number;
    totalLoyaltyPoints: number;
  };
  hourlyOrderTrends: Array<{
    hour: number;
    orders: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/admin/login');
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await adminApi.getDashboard();
      console.log("data", data);
      setDashboardData(data);
    } catch (error) {
      console.log('Failed to fetch dashboard data:', error);
      // Set default dashboard data when API fails
      setDashboardData(getDefaultDashboardData());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultDashboardData = (): DashboardData => {
    return {
      overview: {
        totalTables: 0,
        availableTables: 0,
        occupiedTables: 0,
        totalCustomers: 0,
        totalStaff: 0,
        totalProducts: 0,
      },
      todayStats: {
        totalOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
      },
      recentOrders: [],
      topProducts: [],
      customerStats: {
        newCustomers: 0,
        returningCustomers: 0,
        totalLoyaltyPoints: 0,
      },
      hourlyOrderTrends: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        orders: 0,
        revenue: 0,
      })),
    };
  };

  const handleLogout = () => {
    authApi.logout();
    setLocation('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'served': return 'bg-purple-100 text-purple-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Restaurant Self-Ordering System</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setLocation('/admin/tables')}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Manage</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tables</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalTables}</p>
                  <p className="text-xs text-green-600">
                    {dashboardData.overview.availableTables} available
                  </p>
                </div>
                <TableIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.todayStats.totalOrders}</p>
                  <p className="text-xs text-blue-600">
                    {dashboardData.todayStats.completedOrders} completed
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${dashboardData.todayStats.totalRevenue.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600">
                    Avg: ${dashboardData.todayStats.averageOrderValue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Staff</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.totalStaff}</p>
                  <p className="text-xs text-blue-600">
                    {dashboardData.overview.totalCustomers} customers
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{order.orderNumber}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.table.name} • {order.customer?.name || 'Walk-in'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Top Products Today</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.topProducts.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{product.productName}</p>
                      <p className="text-sm text-gray-600">{product.orderCount} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => setLocation('/admin/tables')}
                className="flex items-center space-x-2 h-12"
                variant="outline"
              >
                <TableIcon className="h-4 w-4" />
                <span>Manage Tables</span>
              </Button>
              <Button
                onClick={() => setLocation('/admin/customers')}
                className="flex items-center space-x-2 h-12"
                variant="outline"
              >
                <Users className="h-4 w-4" />
                <span>View Customers</span>
              </Button>
              <Button
                onClick={() => setLocation('/admin/orders')}
                className="flex items-center space-x-2 h-12"
                variant="outline"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Order History</span>
              </Button>
              <Button
                onClick={() => setLocation('/admin/users')}
                className="flex items-center space-x-2 h-12"
                variant="outline"
              >
                <UserCheck className="h-4 w-4" />
                <span>Manage Staff</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
              <Button
                onClick={() => setLocation('/admin/menu')}
                className="flex items-center space-x-2 h-12"
                variant="outline"
              >
                <ChefHat className="h-4 w-4" />
                <span>View Menu</span>
              </Button>
              <Button
                onClick={() => setLocation('/admin/dashboard')}
                className="flex items-center space-x-2 h-12"
                variant="outline"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}