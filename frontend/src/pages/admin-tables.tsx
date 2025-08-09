import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { adminApi, isAuthenticated, ApiError } from '@/lib/api';
import { config } from '@/lib/config';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  TableIcon, 
  Users, 
  MapPin,
  QrCode,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Table {
  id: number;
  name: string;
  seats: number;
  location?: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

interface TableFormData {
  name: string;
  seats: number;
  location: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  qrCode: string;
}

export default function AdminTables() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<TableFormData>({
    name: '',
    seats: 4,
    location: '',
    status: 'available',
    qrCode: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      setLocation('/admin/login');
      return;
    }

    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const data = await adminApi.getTables();
      setTables(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof ApiError ? error.message : 'Failed to fetch tables',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTable) {
        await adminApi.updateTable(editingTable.id, formData);
      } else {
        await adminApi.createTable(formData);
      }

      toast({
        title: 'Success',
        description: `Table ${editingTable ? 'updated' : 'created'} successfully`
      });
      
      fetchTables();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof ApiError ? error.message : 'Operation failed',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (tableId: number) => {
    if (!confirm('Are you sure you want to delete this table?')) return;

    try {
      await adminApi.deleteTable(tableId);
      toast({
        title: 'Success',
        description: 'Table deleted successfully'
      });
      fetchTables();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof ApiError ? error.message : 'Delete failed',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    setFormData({
      name: table.name,
      seats: table.seats,
      location: table.location || '',
      status: table.status,
      qrCode: table.qrCode || ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTable(null);
    setFormData({
      name: '',
      seats: 4,
      location: '',
      status: 'available',
      qrCode: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateQRCode = () => {
    const qrData = `table-${Date.now()}`;
    setFormData({ ...formData, qrCode: qrData });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tables...</p>
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
                <h1 className="text-xl font-semibold text-gray-900">Table Management</h1>
                <p className="text-sm text-gray-600">Manage restaurant tables and seating</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Table</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingTable ? 'Edit Table' : 'Add New Table'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Table Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Table 1, Booth A1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seats">Number of Seats</Label>
                    <Input
                      id="seats"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Main dining, Patio, Private room"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qrCode">QR Code</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="qrCode"
                        value={formData.qrCode}
                        onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                        placeholder="QR code identifier"
                      />
                      <Button type="button" onClick={generateQRCode} variant="outline">
                        Generate
                      </Button>
                    </div>
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
                      {editingTable ? 'Update Table' : 'Create Table'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-xl font-semibold">
                    {tables.filter(t => t.status === 'available').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Occupied</p>
                  <p className="text-xl font-semibold">
                    {tables.filter(t => t.status === 'occupied').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reserved</p>
                  <p className="text-xl font-semibold">
                    {tables.filter(t => t.status === 'reserved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TableIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Tables</p>
                  <p className="text-xl font-semibold">{tables.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Grid */}
        <Card>
          <CardHeader>
            <CardTitle>All Tables</CardTitle>
          </CardHeader>
          <CardContent>
            {tables.length === 0 ? (
              <div className="text-center py-8">
                <TableIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No tables found</p>
                <p className="text-sm text-gray-500 mb-4">Add your first table to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <Card key={table.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <TableIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{table.name}</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {table.seats} seats
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(table.status)}>
                          {table.status}
                        </Badge>
                      </div>

                      {table.location && (
                        <p className="text-sm text-gray-600 flex items-center mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {table.location}
                        </p>
                      )}

                      {table.qrCode && (
                        <p className="text-sm text-gray-600 flex items-center mb-3">
                          <QrCode className="h-3 w-3 mr-1" />
                          {table.qrCode}
                        </p>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(table)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(table.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}