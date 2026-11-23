CREATE TABLE IF NOT EXISTS usuarios (
 id SERIAL PRIMARY KEY, nombre TEXT NOT NULL, correo TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL, activo BOOLEAN NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS usuario_rol (
 id_usuario INT REFERENCES usuarios(id), modulo TEXT CHECK(modulo IN ('cine','sunat')),
 rol TEXT CHECK(rol IN ('cliente','administrador','empleado')), PRIMARY KEY(id_usuario,modulo)
);
CREATE TABLE IF NOT EXISTS solicitudes_clave_sol (
 id SERIAL PRIMARY KEY, id_usuario INT NOT NULL REFERENCES usuarios(id),
 razon_social TEXT NOT NULL, ruc VARCHAR(11) NOT NULL CHECK(ruc ~ '^[0-9]{11}$'),
 representante TEXT NOT NULL, correo TEXT NOT NULL, descripcion VARCHAR(2000) NOT NULL DEFAULT '',
 estado TEXT NOT NULL DEFAULT 'registrado' CHECK(estado IN ('registrado','en proceso','aprobada','rechazado')),
 fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now(), actualizado_por INT REFERENCES usuarios(id)
);
CREATE TABLE IF NOT EXISTS funciones (
 id SERIAL PRIMARY KEY, titulo TEXT NOT NULL, descripcion TEXT NOT NULL DEFAULT '', sala TEXT NOT NULL,
 fecha TIMESTAMPTZ NOT NULL, precio_centimos INT NOT NULL CHECK(precio_centimos>0),
 imagen_key TEXT, activo BOOLEAN NOT NULL DEFAULT true
);
CREATE TABLE IF NOT EXISTS compras_entradas_cine (
 id SERIAL PRIMARY KEY, id_usuario INT NOT NULL REFERENCES usuarios(id),
 id_funcion INT NOT NULL REFERENCES funciones(id), id_emisor INT NOT NULL REFERENCES usuarios(id),
 asientos TEXT[] NOT NULL, monto NUMERIC(12,2) NOT NULL CHECK(monto>0),
 tipo_comprobante TEXT NOT NULL CHECK(tipo_comprobante IN ('boleta','factura')),
 doc_cliente VARCHAR(11) NOT NULL, id_clave_sol INT REFERENCES solicitudes_clave_sol(id),
 numero_comprobante TEXT UNIQUE, estado TEXT NOT NULL DEFAULT 'pagado' CHECK(estado IN ('pagado','anulado')),
 fecha TIMESTAMPTZ NOT NULL DEFAULT now(), idempotency_key UUID NOT NULL UNIQUE,
 CHECK((id_clave_sol IS NULL)=(numero_comprobante IS NULL))
);
CREATE TABLE IF NOT EXISTS reservas_asientos (
 id_funcion INT REFERENCES funciones(id), asiento TEXT NOT NULL,
 id_compra INT NOT NULL REFERENCES compras_entradas_cine(id), PRIMARY KEY(id_funcion,asiento)
);
CREATE TABLE IF NOT EXISTS observaciones (
 id SERIAL PRIMARY KEY, id_clave_sol INT NOT NULL REFERENCES solicitudes_clave_sol(id),
 id_usuario INT NOT NULL REFERENCES usuarios(id), detalle TEXT NOT NULL, fecha TIMESTAMPTZ DEFAULT now()
);
CREATE SEQUENCE IF NOT EXISTS comprobante_seq;
CREATE TABLE IF NOT EXISTS auditoria (
 id BIGSERIAL PRIMARY KEY, id_usuario INT REFERENCES usuarios(id), accion TEXT NOT NULL,
 entidad TEXT NOT NULL, entidad_id INT NOT NULL, fecha TIMESTAMPTZ NOT NULL DEFAULT now()
);
