# --- Fase 1: Build ---
# Usamos una imagen de Node.js (v18) para construir el proyecto
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias de producción y desarrollo (para compilar TS)
RUN npm install

# Copiamos todo el código fuente (respetando .dockerignore)
COPY . .

# Compilamos TypeScript a JavaScript (el resultado irá a /dist)
RUN npm run build

# --- Fase 2: Producción ---
# Usamos una imagen limpia y ligera para correr la app
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiamos solo el package.json y package-lock.json
COPY package*.json ./

# Instalamos SOLAMENTE las dependencias de producción
RUN npm ci --only=production

# Copiamos el JavaScript compilado (el build) de la fase anterior
COPY --from=builder /usr/src/app/dist ./dist

# El puerto que expone nuestra app (definido en index.ts)
EXPOSE 4000

# El comando para iniciar el servidor de producción
CMD [ "node", "dist/index.js" ]