import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { adminApi, isAuthenticated, ApiError } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Users, 
  Search,
  Mail,
  Phone,
  Calendar,
  Star,
  Gift,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Customer {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  lastVisit?: string;
  isActive: boolean;
  preferences?: any;
  orders?: Array<{ id: number; total: number; status: string; }>;
  createdAt: string;
}

interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  address: string;
  preferences: string;
}

export default function AdminCustomers() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    address: '',
    preferences: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/admin/login');
      return;
    }

    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = async () => {
    try {
      const data = await adminApi.getCustomers(currentPage, 10);
      setCustomers(data.customers || []);
      setTotalPages(Math.ceil((data.total || 0) / 10));
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof ApiError ? error.message : 'Failed to fetch customers',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('admin_token');
      const url = editingCustomer 
        ? `/api/v1/admin/customers/${editingCustomer.id}`
        : '/api/v1/admin/customers';
      
      const method = editingCustomer ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        preferences: formData.preferences ? JSON.parse(formData.preferences) : {}
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Customer ${editingCustomer ? 'updated' : 'created'} successfully`
        });
        
        fetchCustomers();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Operation failed',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (customerId: number) => {
    if (!confirm('Are you sure you want to deactivate this customer?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/v1/admin/customers/${customerId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Customer deactivated successfully'
        });
        fetchCustomers();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Delete failed',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      phone: customer.phone || '',
      email: customer.email || '',
      dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : '',
      address: customer.address || '',
      preferences: customer.preferences ? JSON.stringify(customer.preferences, null, 2) : ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      address: '',
      preferences: ''
    });
  };

  const addLoyaltyPoints = async (customerId: number, points: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/v1/admin/customers/${customerId}/add-loyalty-points`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ points })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Added ${points} loyalty points`
        });
        fetchCustomers();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add loyalty points',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const filteredCustomers = customers.filter(customer =>
    !searchTerm || 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
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
              <Button
                variant="ghost"
                onClick={() => setLocation('/admin/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Customer Management</h1>
                <p className="text-sm text-gray-600">Manage customer profiles and loyalty</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Customer</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Customer name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="customer@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Full address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences">Preferences (JSON)</Label>
                    <textarea
                      id="preferences"
                      value={formData.preferences}
                      onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                      placeholder='{"dietary": "vegetarian", "allergies": ["nuts"]}'
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCustomer ? 'Update Customer' : 'Create Customer'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-xl font-semibold">{customers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Customers</p>
                  <p className="text-xl font-semibold">
                    {customers.filter(c => c.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gift className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Loyalty Points</p>
                  <p className="text-xl font-semibold">
                    {customers.reduce((sum, c) => sum + c.loyaltyPoints, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Phone className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">With Phone</p>
                  <p className="text-xl font-semibold">
                    {customers.filter(c => c.phone).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No customers found</p>
                <p className="text-sm text-gray-500 mb-4">Add your first customer to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <Card key={customer.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{customer.name || 'Anonymous'}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                {customer.email && (
                                  <span className="flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {customer.email}
                                  </span>
                                )}
                                {customer.phone && (
                                  <span className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {customer.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Total Orders</p>
                              <p className="font-semibold">{customer.totalOrders}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Total Spent</p>
                              <p className="font-semibold">${customer.totalSpent?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Loyalty Points</p>
                              <p className="font-semibold flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                {customer.loyaltyPoints}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Status</p>
                              <Badge className={customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {customer.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>

                          {customer.address && (
                            <p className="text-sm text-gray-600 mt-2 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {customer.address}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const points = prompt('Enter loyalty points to add:');
                              if (points && !isNaN(Number(points))) {
                                addLoyaltyPoints(customer.id, Number(points));
                              }
                            }}
                            className="text-yellow-600"
                          >
                            <Gift className="h-3 w-3 mr-1" />
                            Add Points
                          </Button>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(customer)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(customer.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}