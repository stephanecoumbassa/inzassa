import mongoose from 'mongoose';

export default async () => {
  const config = useRuntimeConfig();
  
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
};
