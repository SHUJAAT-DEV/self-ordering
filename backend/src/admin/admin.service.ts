import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Table, TableStatus } from '../tables/entities/table.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Customer } from '../customers/entities/customer.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Subcategory } from '../categories/entities/subcategory.entity';
import * as bcrypt from 'bcrypt';

export interface CreateTableDto {
  name: string;
  seats: number;
  location?: string;
  qrCode?: string;
}

export interface UpdateTableDto {
  name?: string;
  seats?: number;
  location?: string;
  status?: TableStatus;
  qrCode?: string;
}

export interface CreateCustomerDto {
  name?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: Date;
  address?: string;
  preferences?: any;
}

export interface CreateUserDto {
  name: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface AdminDashboardData {
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
  recentOrders: Order[];
  topProducts: Array<{
    productId: number;
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

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoriesRepository: Repository<Subcategory>,
  ) {}

  // Dashboard
  async getDashboardData(): Promise<AdminDashboardData> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Overview counts with error handling
      const [
        totalTables,
        availableTables,
        occupiedTables,
        totalCustomers,
        totalStaff,
        totalProducts
      ] = await Promise.allSettled([
        this.tablesRepository.count().catch(() => 0),
        this.tablesRepository.count({ where: { status: TableStatus.AVAILABLE } }).catch(() => 0),
        this.tablesRepository.count({ where: { status: TableStatus.OCCUPIED } }).catch(() => 0),
        this.customersRepository.count({ where: { isActive: true } }).catch(() => 0),
        this.usersRepository.count({ where: { isActive: true } }).catch(() => 0),
        this.productsRepository.count({ where: { isActive: true } }).catch(() => 0),
      ]).then(results => results.map(result => 
        result.status === 'fulfilled' ? result.value : 0
      ));

    // Today's orders with error handling
    const todayOrders = await this.ordersRepository.find({
      where: { createdAt: Between(today, tomorrow) },
      relations: ['items', 'customer'],
    }).catch(() => []);

    const completedTodayOrders = todayOrders.filter(order => order.status === OrderStatus.PAID);
    const totalRevenue = completedTodayOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = completedTodayOrders.length > 0 ? totalRevenue / completedTodayOrders.length : 0;

    // Recent orders (last 10) with error handling
    const recentOrders = await this.ordersRepository.find({
      relations: ['table', 'customer', 'items'],
      order: { createdAt: 'DESC' },
      take: 10,
    }).catch(() => []);

    // Top products today
    const productStats = new Map();
    completedTodayOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = productStats.get(item.productId) || {
          productId: item.productId,
          productName: item.product?.name || 'Unknown',
          orderCount: 0,
          revenue: 0,
        };
        existing.orderCount += item.quantity;
        existing.revenue += Number(item.totalPrice);
        productStats.set(item.productId, existing);
      });
    });

    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Customer stats with error handling
    const newCustomers = await this.customersRepository.count({
      where: { createdAt: Between(today, tomorrow) },
    }).catch(() => 0);
    
    const returningCustomers = await this.customersRepository
      .createQueryBuilder('customer')
      .where('customer.lastVisit BETWEEN :today AND :tomorrow', { today, tomorrow })
      .andWhere('customer.totalOrders > :minOrders', { minOrders: 1 })
      .getCount()
      .catch(() => 0);

    const totalLoyaltyPoints = await this.customersRepository
      .createQueryBuilder('customer')
      .select('SUM(customer.loyaltyPoints)', 'total')
      .getRawOne()
      .catch(() => ({ total: 0 }));

    // Hourly trends
    const hourlyOrderTrends = Array.from({ length: 24 }, (_, hour) => {
      const hourOrders = todayOrders.filter(order => order.createdAt.getHours() === hour);
      const hourRevenue = hourOrders.reduce((sum, order) => 
        sum + (order.status === OrderStatus.PAID ? Number(order.total) : 0), 0);
      
      return {
        hour,
        orders: hourOrders.length,
        revenue: hourRevenue,
      };
    });

    return {
      overview: {
        totalTables,
        availableTables,
        occupiedTables,
        totalCustomers,
        totalStaff,
        totalProducts,
      },
      todayStats: {
        totalOrders: todayOrders.length,
        completedOrders: completedTodayOrders.length,
        totalRevenue,
        averageOrderValue,
      },
      recentOrders,
      topProducts,
      customerStats: {
        newCustomers,
        returningCustomers,
        totalLoyaltyPoints: totalLoyaltyPoints?.total || 0,
      },
      hourlyOrderTrends,
    };
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      // Return default data when error occurs
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
    }
  }

  // Table Management
  async getAllTables(): Promise<Table[]> {
    return this.tablesRepository.find({ order: { name: 'ASC' } });
  }

  async createTable(createTableDto: CreateTableDto): Promise<Table> {
    const existingTable = await this.tablesRepository.findOne({
      where: { name: createTableDto.name },
    });

    if (existingTable) {
      throw new BadRequestException('Table name already exists');
    }

    const table = this.tablesRepository.create(createTableDto);
    return this.tablesRepository.save(table);
  }

  async updateTable(id: number, updateTableDto: UpdateTableDto): Promise<Table> {
    const table = await this.tablesRepository.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException('Table not found');
    }

    if (updateTableDto.name && updateTableDto.name !== table.name) {
      const existing = await this.tablesRepository.findOne({
        where: { name: updateTableDto.name },
      });
      if (existing) {
        throw new BadRequestException('Table name already exists');
      }
    }

    Object.assign(table, updateTableDto);
    return this.tablesRepository.save(table);
  }

  async deleteTable(id: number): Promise<void> {
    const table = await this.tablesRepository.findOne({ where: { id } });
    if (!table) {
      throw new NotFoundException('Table not found');
    }

    // Check if table has active orders
    const activeOrders = await this.ordersRepository.count({
      where: {
        tableId: id,
        status: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY] as any,
      },
    });

    if (activeOrders > 0) {
      throw new BadRequestException('Cannot delete table with active orders');
    }

    await this.tablesRepository.remove(table);
  }

  // Customer Management
  async getAllCustomers(page: number = 1, limit: number = 50): Promise<{
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [customers, total] = await this.customersRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['orders'],
    });

    return { customers, total, page, limit };
  }

  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['orders', 'orders.items', 'orders.table'],
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    if (createCustomerDto.email) {
      const existing = await this.customersRepository.findOne({
        where: { email: createCustomerDto.email },
      });
      if (existing) {
        throw new BadRequestException('Customer with this email already exists');
      }
    }

    const customer = this.customersRepository.create(createCustomerDto);
    return this.customersRepository.save(customer);
  }

  async updateCustomer(id: number, updateCustomerDto: Partial<CreateCustomerDto>): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existing = await this.customersRepository.findOne({
        where: { email: updateCustomerDto.email },
      });
      if (existing) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return this.customersRepository.save(customer);
  }

  async deleteCustomer(id: number): Promise<void> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    customer.isActive = false;
    await this.customersRepository.save(customer);
  }

  // User Management
  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existing) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async updateUser(id: number, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existing = await this.usersRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existing) {
        throw new BadRequestException('Username already exists');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = false;
    await this.usersRepository.save(user);
  }

  // Order History Management
  async getOrderHistory(
    page: number = 1,
    limit: number = 50,
    filters?: {
      status?: OrderStatus;
      tableId?: number;
      customerId?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    let query = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .orderBy('order.createdAt', 'DESC');

    if (filters) {
      if (filters.status) {
        query = query.andWhere('order.status = :status', { status: filters.status });
      }
      if (filters.tableId) {
        query = query.andWhere('order.tableId = :tableId', { tableId: filters.tableId });
      }
      if (filters.customerId) {
        query = query.andWhere('order.customerId = :customerId', { customerId: filters.customerId });
      }
      if (filters.startDate) {
        query = query.andWhere('order.createdAt >= :startDate', { startDate: filters.startDate });
      }
      if (filters.endDate) {
        query = query.andWhere('order.createdAt <= :endDate', { endDate: filters.endDate });
      }
    }

    const [orders, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { orders, total, page, limit };
  }

  // Menu Management
  async getAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['category', 'subcategory'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['subcategories'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  // System Analytics
  async getSystemAnalytics(days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.ordersRepository.find({
      where: { createdAt: Between(startDate, new Date()) },
      relations: ['items', 'table'],
    });

    const completedOrders = orders.filter(order => order.status === OrderStatus.PAID);
    const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.total), 0);

    // Daily breakdown
    const dailyStats = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayOrders = orders.filter(order => 
        order.createdAt >= date && 
        order.createdAt < new Date(date.getTime() + 24 * 60 * 60 * 1000)
      );
      
      const dayCompletedOrders = dayOrders.filter(order => order.status === OrderStatus.PAID);
      const dayRevenue = dayCompletedOrders.reduce((sum, order) => sum + Number(order.total), 0);

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        orders: dayOrders.length,
        completedOrders: dayCompletedOrders.length,
        revenue: dayRevenue,
      });
    }

    return {
      summary: {
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        totalRevenue,
        averageOrderValue: completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0,
        period: `${days} days`,
      },
      dailyStats: dailyStats.reverse(),
    };
  }
}