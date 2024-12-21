# Backend: Proyecto Final Slack Clone

## Descripción

En este proyecto, desarrollé el backend para una aplicación de chat inspirada en Slack. El backend se encarga de manejar la autenticación, la gestión de workspaces y canales, el almacenamiento y la recuperación de mensajes en tiempo real, entre otras funcionalidades.

## **Características**
- **Autenticación**: Registro de usuarios, verificación de cuenta, inicio de sesión y recuperación de contraseñas.
- **Gestión de Workspaces**: Creación, actualización y eliminación de espacios de trabajo.
- **Gestión de Canales**: Creación, actualización y eliminación de canales dentro de los workspaces.
- **Mensajes**: Envío, recepción y eliminación de mensajes en tiempo real.
- **Seguridad**: Uso de JWT para autenticación y autorización de usuarios.
- **API RESTful**: Endpoints bien definidos para interacciones entre el frontend y el backend.

## Tecnologías y Librerías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript en el servidor.
- **Express**: Framework para construir aplicaciones web y APIs.
- **MongoDB**: Base de datos NoSQL utilizada para almacenar los datos de la aplicación.
- **Mongoose**: Librería para modelado de datos en MongoDB.
- **JWT**: Para autenticación y autorización.
- **Bcrypt**: Para el hashing de contraseñas.
- **Dotenv**: Manejo de variables de entorno.
- **Nodemailer**: Envío de correos electrónicos para la verificación de cuenta y recuperación de contraseña.
- **Cors**: Habilitación de solicitudes HTTP entre diferentes orígenes.
- **Express Validator**: Validación de datos en las rutas de Express.

## Middlewares

### Autenticación

- **`verifyTokenMiddleware`**: Verifica el token JWT en las solicitudes para asegurar que el usuario esté autenticado y tenga los permisos necesarios.
- **`verifyApiKeyMiddleware`**: Verifica si la solicitud contiene una API key válida para autenticar accesos internos.
- **`verifyWorkspaceCreatorMiddleware`**: Verifica si el usuario es el creador de un workspace antes de permitir ciertas acciones.

### Validación

- **`validateEmail`**: Valida el formato del correo electrónico.
- **`validatePassword`**: Valida la contraseña (mínimo 8 caracteres, al menos un número, una mayúscula, y un carácter especial).
- **`validateName`**: Valida que el nombre no esté vacío y tenga al menos 3 caracteres.
- **`validateWorkspaceName`**: Valida que el nombre del workspace tenga al menos 8 caracteres.
- **`validateChannelName`**: Valida que el nombre del canal tenga al menos 6 caracteres.
- **`validateMessageContent`**: Valida que el contenido del mensaje no esté vacío.
- **`handleErrors`**: Maneja los errores de validación y devuelve una respuesta con los detalles.

## **Endpoints de la API**

### Autenticación
- [✔] **POST /api/auth/register**: Registro de nuevo usuario.
- [✔] **GET /api/auth/verify/:verification_token**: Verificación del correo electrónico usando un token.
- [✔] **POST /api/auth/login**: Inicio de sesión.
- [✔] **POST /api/auth/forgot-password**: Solicitud de restablecimiento de contraseña.
- [✔] **PUT /api/auth/reset-password/:reset_token**: Restablecimiento de contraseña usando un token.

### Workspaces
- [✔] **GET /api/workspace**: Obtención de todos los workspaces (requiere autenticación).
- [✔] **POST /api/workspace/create**: Creación de un nuevo workspace (requiere autenticación).
- [✖] **GET /api/workspace/:workspace_id**: Obtención de un workspace específico por ID (requiere autenticación).
- [✖] **PUT /api/workspace/:workspace_id**: Actualización de un workspace (requiere autenticación y permisos de creador).
- [✖] **DELETE /api/workspace/:workspace_id**: Eliminación de un workspace (requiere autenticación y permisos de creador).

### Canales
- [✔] **GET /api/channel/:workspace_id/channels**: Obtención de todos los canales en un workspace específico (requiere autenticación).
- [✔] **POST /api/channel/:workspace_id/create**: Creación de un canal dentro de un workspace (requiere autenticación y permisos de creador).
- [✖] **GET /api/channel/:channel_id**: Obtención de un canal específico por ID (requiere autenticación).
- [✖] **PUT /api/channel/:workspace_id/:channel_id**: Actualización de un canal en un workspace (requiere autenticación y permisos de creador).
- [✖] **DELETE /api/channel/:workspace_id/:channel_id**: Eliminación de un canal en un workspace (requiere autenticación y permisos de creador).

### Mensajes
- [✔] **GET /api/message/:channel_id**: Obtención de todos los mensajes en un canal específico (requiere autenticación).
- [✔] **POST /api/message/:channel_id/create**: Envío de un mensaje en un canal (requiere autenticación).
- [✔] **DELETE /api/message/:message_id/delete**: Eliminación de un mensaje por ID (requiere autenticación).

### **Miembros de Workspaces**
- [✖] **POST /api/workspace/:workspace_id/member**: Añadir un miembro a un workspace (requiere autenticación y permisos de creador).
- [✖] **DELETE /api/workspace/:workspace_id/member/:user_id**: Eliminar un miembro de un workspace (requiere autenticación y permisos de creador).
- [✖] **GET /api/workspace/:workspace_id/members**: Obtención de todos los miembros de un workspace (requiere autenticación).

### Leyenda:
- [✔] Usado en el frontend.
- [✖] No usado en el frontend.*

*Algunos endpoints ya están implementados en el backend pero no se utilizan actualmente en el frontend. Estos están disponibles para futuras integraciones. Todos los endpoints han sido probados con Postman y funcionan correctamente.

## **Credenciales de Prueba**
Puedes usar las siguientes credenciales para acceder al sistema:

**Usuario:** p92068967@gmail.com  
**Contraseña:** Juan.12345





