import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query, 
  ParseIntPipe 
} from '@nestjs/common';
import { 
  AdminService, 
  CreateTableDto, 
  UpdateTableDto, 
  CreateCustomerDto, 
  CreateUserDto 
} from './admin.service';
import { OrderStatus } from '../orders/entities/order.entity';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Dashboard
  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardData();
  }

  @Get('analytics')
  async getAnalytics(@Query('days') days?: string) {
    const dayCount = days ? parseInt(days) : 30;
    return this.adminService.getSystemAnalytics(dayCount);
  }

  // Table Management
  @Get('tables')
  async getAllTables() {
    return this.adminService.getAllTables();
  }

  @Post('tables')
  async createTable(@Body() createTableDto: CreateTableDto) {
    return this.adminService.createTable(createTableDto);
  }

  @Put('tables/:id')
  async updateTable(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTableDto: UpdateTableDto
  ) {
    return this.adminService.updateTable(id, updateTableDto);
  }

  @Delete('tables/:id')
  async deleteTable(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteTable(id);
    return { message: 'Table deleted successfully' };
  }

  // Customer Management
  @Get('customers')
  async getAllCustomers(
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 50;
    return this.adminService.getAllCustomers(pageNum, limitNum);
  }

  @Get('customers/:id')
  async getCustomerById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getCustomerById(id);
  }

  @Post('customers')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.adminService.createCustomer(createCustomerDto);
  }

  @Put('customers/:id')
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: Partial<CreateCustomerDto>
  ) {
    return this.adminService.updateCustomer(id, updateCustomerDto);
  }

  @Delete('customers/:id')
  async deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteCustomer(id);
    return { message: 'Customer deactivated successfully' };
  }

  // User Management
  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Put('users/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Partial<CreateUserDto>
  ) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.adminService.deleteUser(id);
    return { message: 'User deactivated successfully' };
  }

  // Order History
  @Get('orders')
  async getOrderHistory(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: OrderStatus,
    @Query('tableId') tableId?: string,
    @Query('customerId') customerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 50;
    
    const filters: any = {};
    if (status) filters.status = status;
    if (tableId) filters.tableId = parseInt(tableId);
    if (customerId) filters.customerId = parseInt(customerId);
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.adminService.getOrderHistory(pageNum, limitNum, filters);
  }

  // Menu Management
  @Get('products')
  async getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @Get('categories')
  async getAllCategories() {
    return this.adminService.getAllCategories();
  }

  // Quick Actions
  @Post('tables/:id/clear')
  async clearTable(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.updateTable(id, { status: 'available' as any });
  }

  @Post('customers/:id/add-loyalty-points')
  async addLoyaltyPoints(
    @Param('id', ParseIntPipe) id: number,
    @Body('points') points: number
  ) {
    const customer = await this.adminService.getCustomerById(id);
    const updatedPoints = customer.loyaltyPoints + points;
    
    return this.adminService.updateCustomer(id, { 
      preferences: { ...customer.preferences, loyaltyPoints: updatedPoints }
    });
  }

  // System Information
  @Get('system-info')
  async getSystemInfo() {
    return {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'PostgreSQL',
      features: [
        'Real-time orders via SSE',
        'Offline PWA support',
        'Image caching',
        'Customer loyalty system',
        'Advanced reporting',
        'Multi-role user management'
      ]
    };
  }

  // Database Statistics
  @Get('database-stats')
  async getDatabaseStats() {
    const [
      totalTables,
      totalCustomers, 
      totalUsers,
      totalProducts,
      totalOrders
    ] = await Promise.all([
      this.adminService.getAllTables(),
      this.adminService.getAllCustomers(1, 1),
      this.adminService.getAllUsers(),
      this.adminService.getAllProducts(),
      this.adminService.getOrderHistory(1, 1)
    ]);

    return {
      tables: totalTables.length,
      customers: totalCustomers.total,
      users: totalUsers.length,
      products: totalProducts.length,
      orders: totalOrders.total,
      timestamp: new Date().toISOString()
    };
  }
}