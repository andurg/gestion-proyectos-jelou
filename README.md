## AUTOR: JUAN ANDRES URGILES

# Plataforma de Gestión de Proyectos y Tareas

Esta es una plataforma colaborativa para la gestión de proyectos y tareas, construida con TypeScript, MongoDB y VITE, se programó para ser robusta y segura.

Los usuarios pueden registrarse, crear proyectos, añadir colaboradores, y gestionar tareas a través de un tablero Kanban.

Este proyecto está construido bajo el siguiente stack:

Backend
Runtime: Node.js
Framework: Express.js
Lenguaje: TypeScript
Base de Datos: MongoDB (con Mongoose)
Autenticación JWT (JSON Web Tokens)
Documentación API: Swagger (OpenAPI)
Testing: Jest & Supertest

Frontend
Framework: React 18 (con Vite)
Lenguaje: TypeScript
Estilos: TailwindCSS
Gestión de Estado: React Context API

---

Estructura del Proyecto

├── backend/ 
    # Código fuente del servidor (Node.js, Express, TS) 
├── frontend/ 
    # Código fuente del cliente (React, Vite, TS) 
├── TECHNICAL_DECISIONS.md 
    # Documentación de decisiones técnicas 
├── docker-compose.yml 
    # Define el servicio de la base de datos MongoDB 
└── README.md 

Instrucciones de Ejecución

Pasos para levantar el proyecto completo en una máquina local.

Prerrequisitos

Tener instaladas las siguientes herramientas:
Node.js: v18 o superior 
Docker Desktop: Debe estar instalado y "Running"
Git: Para clonar el repositorio.

1. Clonar el Repositorio

--bash
git clone https://github.com/andurg/gestion-proyectos-jelou.git
cd GestionProyectos

2. Configurar la Base de Datos
El proyecto usa Docker para ejecutar la base de datos MongoDB en un contenedor, Desde la raíz del proyecto (GestionProyectos/):

--bash
docker-compose up -d

Esto iniciará un contenedor de MongoDB en localhost:27017 con las credenciales definidas en docker-compose.yml.

3. Configurar el Backend
El backend necesita un archivo .env para conectarse a la base de datos y firmar los tokens JWT.

Navega a la carpeta del backend:

--bash

cd backend

#Instala las dependencias:

npm install

Crea un archivo .env en la raíz de /backend:

New-Item -ItemType File -Name ".env"

Añade el siguiente contenido al archivo backend/.env. :

# Variables de entorno del Backend (backend/.env)

# Cadena de conexión a la BD de Docker
MONGO_URI=mongodb://admin:password@localhost:27017/gestionproyectos?authSource=admin

# URI para la base de datos de pruebas (usada por Jest)
MONGO_TEST_URI=mongodb://admin:password@localhost:27017/gestionproyectos_test?authSource=admin

# Secreto para firmar los JSON Web Tokens (cámbialo por una frase larga y segura)
JWT_SECRET=passdepruebajelou123456789

4. Configurar el Frontend
Abre una segunda terminal y navega a la carpeta del frontend:

--bash
cd frontend

Instala las dependencias:

--bash

npm install

5. Ejecutar la Aplicación
Debes tener dos terminales abiertas y el contenedor de Docker corriendo.

Terminal 1 (Backend):

--bash

# (Estando en la carpeta /backend)
npm run dev

# Tu API estará corriendo en http://localhost:4000


Terminal 2 (Frontend):

--bash

# (Estando en la carpeta /frontend)
npm run dev

# La aplicación de React estará disponible en http://localhost:5173


-----
Pruebas (Testing)

El backend incluye un set de pruebas (Jest y Supertest) que verifica la autenticación y las rutas protegidas. Las pruebas se ejecutan contra una base de datos de pruebas (gestionproyectos_test).

--bash

# (Estando en la carpeta /backend)
npm test

------
Documentación de la API (Swagger)

La API del backend está completamente documentada con Swagger. Una vez que el servidor del backend esté corriendo, puedes acceder a la documentación interactiva en: http://localhost:4000/api-docs
