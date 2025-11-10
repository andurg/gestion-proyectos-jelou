import express, { Request, Response } from 'express';
import 'dotenv/config'; 

// Importar Swagger (si no, da error en tests)
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Importamos nuestras rutas
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();

// Middlewares ESENCIALES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// --- Configuración de Swagger ---
// (Necesitamos mover esto aquí para que 'app' lo conozca)
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Gestión de Proyectos',
    version: '1.0.0',
    description: 'Documentación de la API para la plataforma de gestión de proyectos.',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 4000}`, // Usar env
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Introduce tu token JWT en formato: Bearer <token>',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          msg: { type: 'string', description: 'Mensaje de error' }
        }
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                value: { type: 'string' },
                msg: { type: 'string' },
                path: { type: 'string' },
                location: { type: 'string' }
              }
            }
          }
        }
      }
    }
  },
};
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], 
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// --- Definición de Rutas ---
app.get('/api', (req: Request, res: Response) => {
  res.send('¡API de Gestión de Proyectos funcionando!');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Exportamos 'app' para las pruebas y para index.ts
export default app;