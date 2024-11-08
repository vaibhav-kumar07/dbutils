import { applyPaginationFilter } from './filter';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';
const DATABASE_NAME = process.env.MONGO_DB_NAME || 'test_db';
const CONNECTION_TIMEOUT = parseInt(process.env.MONGO_TIMEOUT || '15000', 10);

console.log('Loaded MONGO_URI:', MONGO_URI);
if (!MONGO_URI)
  throw new Error('MONGO_URI is required in the environment variables.');
if (!DATABASE_NAME)
  console.warn(
    'DATABASE_NAME is missing; using database name in URI if available.'
  );

console.log('Preparing to connect to MongoDB...');

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: DATABASE_NAME,
      minPoolSize: 5,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
    });
    console.info('Connected to MongoDB:' + MONGO_URI);
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message || error);
  }
};

const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1; // 1 means connected
};

const closeDatabaseConnection = (): void => {
  mongoose
    .disconnect()
    .then(() => console.info('MongoDB disconnected successfully.'))
    .catch((err) => console.error('Error disconnecting MongoDB:', err));
};

const reconnectDatabase = async (): Promise<void> => {
  if (!isDatabaseConnected()) {
    console.info('Attempting to reconnect to MongoDB...');
    await connectToDatabase();
  } else {
    console.info('MongoDB is already connected.');
  }
};

export = {
  connectToDatabase,
  isDatabaseConnected,
  closeDatabaseConnection,
  reconnectDatabase,
  applyPaginationFilter,
};
