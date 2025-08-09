import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export const seedAdminUser = async (dataSource: DataSource): Promise<void> => {
  const userRepository = dataSource.getRepository(User);

  // Check if admin user already exists
  const existingAdmin = await userRepository.findOne({
    where: { username: 'admin' }
  });

  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed...');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = userRepository.create({
    name: 'System Administrator',
    username: 'admin',
    password: hashedPassword,
    role: UserRole.ADMIN,
    isActive: true,
  });

  await userRepository.save(adminUser);
  console.log('✅ Admin user created successfully!');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('   Role: admin');
};