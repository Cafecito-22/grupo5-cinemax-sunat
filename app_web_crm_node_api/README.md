# SUNAT · Grupo 5

Portal de contribuyentes, revisión de solicitudes y fiscalización. Frontend React + Bootstrap en Vercel; API Node.js en Render; PostgreSQL compartido en Neon e imágenes privadas en Object Storage compatible con S3.

## Enlaces publicados

- Contribuyentes: https://grupo5-sunat-cliente.vercel.app
- Gestión: https://grupo5-sunat-gestion.vercel.app
- Estado de la API: https://grupo5-facturacion-api.onrender.com/api/salud

Esta entrega contiene únicamente la aplicación SUNAT. El módulo de ventas y la interfaz CineMax los desarrolla el otro integrante. Las tablas compartidas se conservan para relacionar las solicitudes aprobadas con los comprobantes.

## Organización

La raíz contiene únicamente las tres carpetas de aplicaciones y `.gitignore`. El esquema SQL, las migraciones, Postman, pruebas, documentación y configuración de Render están dentro del backend. Las imágenes originales están en la carpeta del frontend cliente; la web las sirve desde Object Storage.

## Servicios separados

| Carpeta | Servicio | Destino |
|---|---|---|
| `app_web_crm_node_api` | API SUNAT, autorización y conexión a datos | Render |
| `app_web_crm_react_cliente` | Portal de contribuyentes React | Vercel |
| `app_web_crm_react_adm_emp` | Portal de gestión React | Vercel |

Los dos portales usan los mismos componentes, una sola sesión por portal y rutas protegidas según `usuario_rol`. Se mantienen los nombres de carpeta para conservar las raíces de despliegue existentes.

## Desarrollo local

1. Desde esta carpeta de backend: `npm ci`, copia `.env.example` a `.env` y configura las variables privadas.
2. En una base nueva o en la base compartida existente, ejecuta `npm run db:init`. Esta migración es aditiva: no borra compras, usuarios ni solicitudes.
3. Opcionalmente define `SEED_PASSWORD` de al menos 12 caracteres y ejecuta `npm run db:seed`. Crea diez contribuyentes con tres solicitudes cada uno, un trabajador y una jefatura. No cambia contraseñas existentes.
4. API: `npm run dev` (puerto 3000 por defecto; el entorno QA usa 3105).
5. En cada frontend, `npm ci`, configura `VITE_API_URL` y ejecuta `npm run dev`. El cliente utiliza 5173 y la gestión debe usar 5174.

En producción solo el servidor recibe `DATABASE_URL`, `JWT_SECRET` y las variables S3. El frontend recibe únicamente la URL pública de la API. Nunca publiques archivos `.env` o entornos de Postman con credenciales.

## Funciones

- Registro, acceso y perfil con contraseñas cifradas, sesión expirable y validación de rol en servidor.
- Solicitudes: registro, consulta propia, corrección mientras están registradas, retirada y seguimiento con historial.
- Trabajador: revisión, cambio de estado, observaciones y atención digital, respetando su turno de Lima.
- Jefatura: gestión de solicitudes, usuarios, turnos y auditoría.
- Comprobantes recibidos y total de ventas por contribuyente mediante `SUM ... GROUP BY`.
- Accesos de integración de 15 minutos, revocación y validación de clave SOL aprobada en cada operación.
- Fondo animado, guía de tres pasos, carta de envío, estados accesibles y diseño adaptable a celular. Se respeta la preferencia de movimiento reducido.
- Fotografías del trabajo original guardadas en Object Storage; la base almacena solo sus referencias.

## Postman e integración

- Importa `postman/SUNAT_Grupo5.postman_collection.json` y `postman/SUNAT_Local.postman_environment.json` en Postman.
- Completa localmente las cuentas de prueba y la compra de la base QA. La colección modifica datos: úsala sobre una copia de pruebas.
- La colección contiene 47 solicitudes y sus aserciones. El informe sin contraseñas ni tokens está en `docs/VERIFICACION_POSTMAN.json`.
- El contrato que debe consumir el compañero está en [docs/INTEGRACION.md](docs/INTEGRACION.md).
- La explicación de cómo compartir Neon sin exponer credenciales está en [docs/BASE_COMPARTIDA.md](docs/BASE_COMPARTIDA.md).

El portal implementa el flujo académico del Grupo 5. No envía declaraciones ni comprobantes a los sistemas oficiales de SUNAT y no procesa pagos bancarios.
