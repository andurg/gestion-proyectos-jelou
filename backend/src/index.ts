import 'dotenv/config'; 
import app from './app'; // <-- 1. Importar la app
import { connectDB } from './config/db';

const PORT = process.env.PORT || 4000;

// Conectar a la Base de Datos (dev/prod)
connectDB();

// Encender el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación de la API disponible en http://localhost:${PORT}/api-docs`);
});