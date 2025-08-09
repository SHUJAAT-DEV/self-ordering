import { DataSource } from 'typeorm';
import { seedAdminUser } from './admin-user.seed';

export const runSeeds = async (dataSource: DataSource): Promise<void> => {
  console.log('🌱 Running database seeds...');
  
  try {
    // Run all seeds
    await seedAdminUser(dataSource);
    
    console.log('✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
};