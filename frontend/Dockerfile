# --- Fase 1: Build (Compilar React) ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el código fuente
COPY . .

# Creamos el build de producción (los archivos estáticos)
RUN npm run build

# --- Fase 2: Producción (Servir con Nginx) ---
# Usamos la imagen oficial y ligera de Nginx
FROM nginx:1.25-alpine

# Copiamos los archivos estáticos (el build) desde la Fase 1
# al directorio por defecto que Nginx usa para servir HTML
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Le decimos a Nginx que escuche en el puerto 5173 (el mismo de Vite)
EXPOSE 5173

# Cuando el contenedor inicie, Nginx se iniciará automáticamente
# (CMD por defecto de la imagen de Nginx)