# Portal de administración y empleados

React + Bootstrap.

1. Ejecuta `npm ci`.
2. Copia `.env.example` a `.env` y configura únicamente `VITE_API_URL`.
3. Ejecuta `npm run dev` (puerto 5174).
4. Para producción: `npm run build`; publica `dist` en Vercel.

El backend y los scripts SQL están en `../app_web_crm_node_api`. Las claves de Neon y Object Storage se configuran únicamente en el servidor.
