# Decisiones Técnicas del Proyecto

Stack Tecnológico General:

Se eligió un stack MERN (MongoDB, Express, React, Node.js) consolidando todo con TypeScript tanto en el backend como en el frontend facilitando la consistencia en los tipos de datos (evitando errores entre la API y el cliente) y mejora el desarrollo (autocompletado, refactorización segura).


Base de Datos:

Escogí MongoDB ya que permite un desarrollo más ágil. Las relaciones entre objetos pueden ser modeladas en MongoDB usando 'ObjectId'.

Se puede usar Docker y Docker Compose para la instancia de MongoDB con se evitamos la instalación manual de MongoDB en el SO, en mi caso Windows 11. En caso de un entorno colaborativo todos los desarrolladores usarían exactamente la misma versión y configuración de la BD. 


Backend:

Se usó un patrón de arquitectura: Modelo-Vista-Controlador (MVC), aunque para este proyectro en particular sería Modelo-Ruta-Controlador (MRC). Donde MODELO: es el que define la forma de los datos (MongoDB). RUTA: el que define los *endpoints* de la API y CONTROLADOR: Contiene toda la lógica de negocio. 

Además se usó el framework: Express.js, el framework más usado para la creación de APIs en Node.js. Además cuenta con gran cantidad de *middlewares* que simplifican la mayoria de tareas.


Autenticación y Seguridad.

Se eligió JWT (JSON Web Tokens) ya que es un estandar sin estado donde el servidor no necesita almacenar sesiones; simplemente firma un token en el login y lo verifica en cada petición protegida. El *middleware* `protect` captura todas las peticiones a rutas seguras, verifica el token y adjunta el `user.id` al objeto `req` para su uso en los controladores.


Frontend.

Se usa el server Vite por su velocidad de arranque en desarrollo y su configuración más simple. Y con React se utilizó una arquitectura basada en componentes funcionales y Hooks que es el estándar actual de React.


Gestión de estados en el Frontend.

Para la escala de esta aplicación se usó React Context API la cual es perfectamente capaz de manejar estados globales que no cambian constantemente, como los datos del usuario autenticado y los estados de los proyectos y tareas


Estilos para el Frontend

Escogí TailwindCSS por que poermite realizar un diseño extremadamente rápido sin salir de los archivos '.tsx', evitando la necesidad de crear archivos CSS separados para cada componente.


Documentación 

El uso de Swagger fue la mejor opción ya que proporciona una documentación interactiva que se genera automáticamente a partir de comentarios JSDoc en los archivos de rutas. 

Pruebas (TESTS)
Se utilizó el stack Jest/Supertest para las pruebas de API en Node.js. Permite realizar peticiones HTTP reales a la aplicación en un entorno de pruebas y verificar códigos de estado y respuestas. 
