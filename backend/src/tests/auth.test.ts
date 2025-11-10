import request from 'supertest';
import app from '../app'; // Importamos la app refactorizada
import mongoose from 'mongoose';
import { connectTestDB, disconnectDB, clearDatabase } from '../config/db';

// --- Configuración de las Pruebas ---
beforeAll(async () => {
  await connectTestDB(); // Conectar a la BD de PRUEBAS
});

afterEach(async () => {
  await clearDatabase(); // Limpiar la BD después de CADA prueba
});

afterAll(async () => {
  await disconnectDB(); // Desconectar al final de TODAS las pruebas
});

// --- Suite de Pruebas de Autenticación ---
describe('API de Autenticación /api/auth', () => {

  // Guardaremos un token para usarlo en pruebas protegidas
  let token: string;
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  };

  // Test 1: Registrar un usuario
  it('Test 1: [POST /api/auth/register] debe registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser)
      .expect(201); // Esperamos un '201 Created'
    
    // Verificamos que la respuesta tenga el token y los datos del usuario
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.name).toBe(testUser.name);
  });

  // Test 2: Iniciar sesión con un usuario
  it('Test 2: [POST /api/auth/login] debe iniciar sesión con un usuario existente', async () => {
    // Primero, creamos el usuario
    await request(app).post('/api/auth/register').send(testUser);
    
    // Luego, intentamos iniciar sesión
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200); // Esperamos un '200 OK'
      
    expect(res.body).toHaveProperty('token');
    
    // Guardamos el token para usarlo en otras pruebas
    token = res.body.token;
  });

  // Test 3: Fallar al acceder a ruta protegida sin token
  it('Test 3: [GET /api/projects] debe fallar (401) si no se provee token', async () => {
    await request(app)
      .get('/api/projects')
      .expect(401); // Esperamos un '401 Unauthorized'
  });

  // Test 4: Acceder a ruta protegida CON token
  it('Test 4: [GET /api/projects] debe tener éxito (200) si se provee un token válido', async () => {
    // Reutilizamos el 'token' obtenido en el Test 2
    // (Asegúrate de que el Test 2 se ejecute primero o ten un 'beforeEach' que inicie sesión)
    
    // Vamos a iniciar sesión aquí para asegurar que 'token' esté definido
    await request(app).post('/api/auth/register').send(testUser);
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    token = loginRes.body.token;

    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`) // Enviamos el token
      .expect(200); // Esperamos '200 OK'
      
    // Esperamos que devuelva un array (vacío, en este caso)
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test 5: Crear un proyecto con un token válido
  it('Test 5: [POST /api/projects] debe crear un proyecto (201) si se provee un token válido', async () => {
    // Iniciar sesión para obtener token
    await request(app).post('/api/auth/register').send(testUser);
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    token = loginRes.body.token;

    const newProject = {
      name: 'Proyecto de Prueba',
      description: 'Descripción del proyecto'
    };

    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`) // Autenticamos
      .send(newProject)
      .expect(201); // Esperamos '201 Created'
      
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(newProject.name);
    expect(res.body.owner).toBeDefined();
  });
});