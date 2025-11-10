/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Opcional: define dónde buscar los archivos de prueba
  testMatch: ['<rootDir>/src/tests/**/*.test.ts'],
  // Opcional: Aumentar el tiempo límite si la conexión a la BD es lenta
  testTimeout: 10000,
};