# Grupo 5 — CineMax Perú y SUNAT

Proyecto académico de facturación electrónica. No envía comprobantes reales a SUNAT ni procesa cobros bancarios. Los comprobantes son registros del ejercicio académico.

CineMax se basa en `Parcial-main.zip`: diseño oscuro y rojo, películas originales, inicio público, cartelera, favoritos, reserva, compras, venta del personal, validación de entradas, perfil, películas, clientes y trabajadores con turnos. La implementación anterior de CineMax y sus películas ficticias se reemplazaron. SUNAT conserva clave SOL, comprobantes, observaciones y fiscalización en la misma base con roles por módulo.

## Estructura

1. `app_web_crm_node_api/database`: PostgreSQL único y datos iniciales.
2. `app_web_crm_node_api/src`: configuración, rutas, controladores, servicios, repositorios, middlewares y utilidades.
3. `app_web_crm_react_cliente`: acceso React del cliente.
4. `app_web_crm_react_adm_emp`: acceso React de administración/empleados.
Ambos frontends incluyen `src/api`, `hooks`, `components`, `pages`, `utils`, `styles` y `context`. Comparten las reglas de roles y utilizan la misma API; nunca contienen credenciales de la base de datos.

## Ejecución

Requiere Node 22 o superior, PostgreSQL y Object Storage S3 compatible.

```powershell
npm install
```

Copiar los `.env.example` de cada proyecto como `.env` y completar los valores localmente. Usar la conexión TLS proporcionada por Neon. No desactivar la verificación de certificados. JWT_SECRET debe contener al menos 32 caracteres aleatorios. SEED_PASSWORD es una contraseña temporal de al menos 12 caracteres y solo se utiliza para crear datos de prueba en una base vacía; retirarla del entorno al terminar.

```powershell
npm run db:init --workspace app_web_crm_node_api
npm start --workspace app_web_crm_node_api
npm run dev --workspace app_web_crm_react_cliente
npm run dev --workspace app_web_crm_react_adm_emp
npm test
npm run build
```

Los datos iniciales incluyen 10 clientes (`cliente1@correo.test` a `cliente10@correo.test`), 1 administrador y 1 empleado por módulo: `admin@cinemax.test`, `empleado@cinemax.test`, `admin@sunat.test` y `empleado@sunat.test`. Todos reciben la contraseña temporal definida en SEED_PASSWORD. El administrador CineMax también tiene el rol cliente SUNAT. Se cargan 30 compras, 30 solicitudes de clientes, 3 solicitudes aprobadas CineMax enlazadas a compras y 3 observaciones. Son identidades ficticias; no se crea automáticamente una cuenta con el correo universitario.

Para subir los ocho pósteres originales al bucket privado, extraer `Parcial-main.zip` fuera del repositorio y ejecutar desde el backend:

```powershell
npm run images:upload -- "RUTA_ABSOLUTA_A_Parcial-main/img"
```

La aplicación nunca sirve las imágenes desde archivos locales. Hasta configurar y cargar el bucket, los pósteres no estarán disponibles. La credencial de Neon incrustada en el ZIP original no se copia ni se utiliza; debe rotarse en su proyecto de origen. Esta base es nueva: no ejecutar el esquema sobre tablas de una instalación anterior sin revisar antes una migración.

## Despliegue

- GitHub: publicar este directorio sin `.env`, `node_modules` ni archivos originales adjuntos. Crear el repositorio después de confirmar la cuenta universitaria.
- Render: usar `render.yaml`, completar sus secretos y comprobar `/api/salud`. Inicializar Neon antes de exponer la aplicación.
- Vercel: crear dos proyectos, con los directorios raíz de cada frontend; Instalar desde la raíz del repositorio y compilar el workspace correspondiente. Configurar VITE_API_URL con la URL HTTPS de Render más `/api`. No poner DATABASE_URL ni claves S3 en variables VITE.
- Render FRONTEND_ORIGINS: incluir únicamente los dominios exactos HTTPS de los frontends autorizados.
- Object Storage: bucket privado, credenciales restringidas a ese bucket. Permitir CORS PUT con Content-Type desde ambos frontends. Se generan enlaces temporales y se almacena únicamente la clave del objeto en funciones.imagen_key. El backend comprueba tipo MIME y tamaño antes de asociar una imagen.

## Verificación pendiente de infraestructura

Comprobar inicio de sesión y denegación 401/403, crear solicitud como cliente SUNAT, aprobar como empleado, comprar como cliente CineMax y verificar comprobante en SUNAT. Probar una compra con emisor sin aprobación: debe guardarse sin número ni clave SOL. Probar dos compras del mismo asiento: solo una debe persistir. Volver a enviar una compra con la misma referencia: no debe duplicarse. Confirmar carga/lectura de una imagen en el bucket y que la base solo conserva su clave.

El contenido visible al usuario contiene únicamente las funciones y textos de la aplicación. Las instrucciones de desarrollo se encuentran en este documento.
