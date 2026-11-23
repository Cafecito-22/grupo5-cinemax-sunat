# Contrato SUNAT para CineMax

URL base actual: `https://grupo5-facturacion-api.onrender.com/api`. Todos los datos se intercambian como JSON. En producción usa HTTPS.

## 1. Iniciar sesión una vez

`POST /auth/login`

```json
{"correo":"correo-del-emisor","password":"contraseña-del-emisor"}
```

Devuelve `{ "token": "JWT de sesión", "user": { "id": 1, "roles": [] } }`. La sesión vence en dos horas. Las cuentas nuevas son contribuyentes SUNAT; el compañero asigna de forma controlada su rol en `cine` cuando corresponda. Nunca admitas un rol de administrador enviado libremente por el cliente.

`GET /auth/validar` con `Authorization: Bearer TOKEN_DE_SESION` valida firma, vencimiento, cuenta activa y versión de sesión. El backend compañero puede utilizar esta respuesta para identificar al mismo usuario sin conocer la clave de firma.

## 2. Solicitar Clave SOL

`POST /solicitudes` con el token de sesión del emisor.

```json
{"razon_social":"Empresa SAC","ruc":"20512345678","representante":"Nombre del representante","correo":"correo@empresa.example"}
```

La respuesta incluye `id`, `codigo_seguimiento` y `estado: "registrado"`. El empleado SUNAT revisa la solicitud mediante `PATCH /solicitudes/:id/estado`. Los estados son `registrado`, `en proceso`, `aprobada` y `rechazado`.

La corrección y retirada por el titular solo se permiten mientras está registrada. La identidad de una solicitud aprobada no puede cambiarse. Las solicitudes vinculadas a comprobantes se conservan.

## 3. Obtener acceso temporal de integración

`POST /integracion/token` con el token de sesión del mismo emisor.

```json
{"id_clave_sol":123}
```

Solo funciona si la solicitud pertenece al emisor y está aprobada. Devuelve `token`, `tipo: "Bearer"`, `jti` y `expira_en`. El token de integración vence en 15 minutos. Guárdalo únicamente durante el tiempo necesario en el backend; no en GitHub ni en una URL.

## 4. Validar antes de emitir

`GET /integracion/validar` con `Authorization: Bearer TOKEN_DE_INTEGRACION`.

```json
{"valido":true,"emision_habilitada":true,"id_usuario":1,"id_clave_sol":123,"ruc":"20512345678","razon_social":"Empresa SAC","expira_en":"fecha ISO"}
```

SUNAT vuelve a consultar la aprobación y la revocación. No confíes solo en que el JWT no haya vencido.

## 5. Guardar compra y solicitar comprobante

El servidor CineMax guarda su compra en `compras_entradas_cine`, con el `id_emisor` del mismo usuario. Debe calcular el monto en servidor, validar DNI/RUC, reservar asientos sin duplicados y usar una referencia de compra idempotente.

Si no hay SOL aprobada, la compra se guarda con `id_clave_sol = NULL` y `numero_comprobante = NULL`, y CineMax avisa que no se emitió comprobante.

Con SOL aprobada, solicita `POST /integracion/comprobantes` con el token de integración:

```json
{"id_compra":456}
```

SUNAT lee los datos de esa compra desde la base compartida; no acepta un monto enviado para reemplazar el importe registrado. Verifica emisor, pago, documento, aprobación y propiedad antes de asignar `id_clave_sol` y `numero_comprobante` en una transacción.

- Primera emisión: HTTP 201 y la compra con su número de boleta/factura.
- Reintento de la misma compra: HTTP 200 y el mismo número (`reutilizado: true`). No genera otro comprobante.
- Compra ajena: HTTP 404.
- Token incorrecto o vencido: HTTP 401.
- SOL no aprobada o token revocado: HTTP 403.
- Compra anulada o vinculada a otra SOL: HTTP 409.

Los comprobantes aparecen en `GET /comprobantes`. El personal SUNAT consulta `GET /fiscalizacion`, que aplica `SUM` y `GROUP BY` por RUC y razón social.

## Revocación

El titular puede revocar `DELETE /integracion/tokens/:jti` con su token de sesión. Cambiar la contraseña, desactivar la cuenta, retirar la solicitud o dejar de aprobarla también impide usar accesos vigentes.

Los JWT de sesión y de integración solo son válidos para este sistema académico; no son credenciales oficiales de SUNAT.
