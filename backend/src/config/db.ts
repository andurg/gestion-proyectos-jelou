import mongoose from 'mongoose';
import 'dotenv/config';

// Conexión principal (para 'npm run dev' y producción)
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI no está definida en el archivo .env');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB Conectado Exitosamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); 
  }
};

// --- AÑADIR TODA ESTA SECCIÓN PARA TESTING ---

/**
 * Conexión a la Base de Datos de Pruebas (para Jest)
 */
export const connectTestDB = async () => {
  try {
    const mongoUri = process.env.MONGO_TEST_URI;
    if (!mongoUri) {
      throw new Error('MONGO_TEST_URI no está definida. Revisa tu .env');
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB de Pruebas Conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB de Pruebas:', error);
    process.exit(1);
  }
};

/**
 * Desconectar de la Base de Datos (para Jest)
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error al desconectar de MongoDB:', error);
  }
};

/**
 * Limpiar la Base de Datos (para Jest)
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};