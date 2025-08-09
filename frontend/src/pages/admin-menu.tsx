import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  UtensilsCrossed,
  Tag,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  category: {
    id: number;
    name: string;
  };
  subcategory?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  subcategories?: Array<{
    id: number;
    name: string;
  }>;
}

export default function AdminMenu() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLocation('/admin/login');
      return;
    }

    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/v1/admin/products', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/v1/admin/categories', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }

      if (productsResponse.status === 401 || categoriesResponse.status === 401) {
        localStorage.removeItem('admin_token');
        setLocation('/admin/login');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch menu data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
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
                <h1 className="text-xl font-semibold text-gray-900">Menu Management</h1>
                <p className="text-sm text-gray-600">Manage products and categories</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'products' ? 'default' : 'outline'}
            onClick={() => setActiveTab('products')}
            className="flex items-center space-x-2"
          >
            <UtensilsCrossed className="h-4 w-4" />
            <span>Products ({products.length})</span>
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
            className="flex items-center space-x-2"
          >
            <Tag className="h-4 w-4" />
            <span>Categories ({categories.length})</span>
          </Button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Products</CardTitle>
                <div className="text-sm text-gray-600">
                  Note: Product management requires full product module integration
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <UtensilsCrossed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No products found</p>
                  <p className="text-sm text-gray-500 mb-4">Products will appear here when added through the products module</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{product.category.name}</Badge>
                              {product.subcategory && (
                                <Badge variant="outline" className="text-xs">
                                  {product.subcategory.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(product.price)}
                            </p>
                            <Badge className={product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>

                        {product.image && (
                          <div className="mb-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-32 object-cover rounded-md"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline" disabled>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" disabled className="text-red-600">
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
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <div className="text-sm text-gray-600">
                  Note: Category management requires full categories module integration
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No categories found</p>
                  <p className="text-sm text-gray-500 mb-4">Categories will appear here when added through the categories module</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card key={category.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold">{category.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                            {category.subcategories && category.subcategories.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-700">Subcategories:</p>
                                <div className="flex flex-wrap gap-1">
                                  {category.subcategories.map((sub) => (
                                    <Badge key={sub.id} variant="outline" className="text-xs">
                                      {sub.name}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <Badge className={category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>

                        {category.image && (
                          <div className="mb-3">
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="w-full h-24 object-cover rounded-md"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline" disabled>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" disabled className="text-red-600">
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
        )}

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UtensilsCrossed className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Menu Management</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Complete menu management features are available through the dedicated Products and Categories modules.
                  This interface provides a read-only view for admin oversight. To add, edit, or delete menu items,
                  use the full product management interface or integrate with the existing products API endpoints.
                </p>
                <div className="mt-3 space-x-2">
                  <Button size="sm" variant="outline" disabled>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Product
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Category
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}