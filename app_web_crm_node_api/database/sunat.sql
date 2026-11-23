ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS session_version INT NOT NULL DEFAULT 0;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS turno_nombre TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS turno_inicio TIME;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS turno_fin TIME;
ALTER TABLE solicitudes_clave_sol ADD COLUMN IF NOT EXISTS codigo_seguimiento TEXT GENERATED ALWAYS AS ('SOL-' || lpad(id::text,6,'0')) STORED;
ALTER TABLE solicitudes_clave_sol ADD COLUMN IF NOT EXISTS eliminado BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE solicitudes_clave_sol ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE auditoria ADD COLUMN IF NOT EXISTS detalle JSONB NOT NULL DEFAULT '{}';
CREATE TABLE IF NOT EXISTS integracion_tokens (
 jti UUID PRIMARY KEY, id_usuario INT NOT NULL REFERENCES usuarios(id),
 id_clave_sol INT NOT NULL REFERENCES solicitudes_clave_sol(id),
 expira_en TIMESTAMPTZ NOT NULL, revocado BOOLEAN NOT NULL DEFAULT false, creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS consultas_atencion (
 id SERIAL PRIMARY KEY, id_usuario INT NOT NULL REFERENCES usuarios(id),
 asunto TEXT NOT NULL, mensaje TEXT NOT NULL, respuesta TEXT,
 respondido_por INT REFERENCES usuarios(id), creado_en TIMESTAMPTZ NOT NULL DEFAULT now(), respondido_en TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS recursos_publicos (slug TEXT PRIMARY KEY, storage_key TEXT NOT NULL, alt TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS sol_usuario_estado ON solicitudes_clave_sol(id_usuario,estado) WHERE eliminado=false;
CREATE INDEX IF NOT EXISTS compras_sol ON compras_entradas_cine(id_clave_sol);
CREATE INDEX IF NOT EXISTS observaciones_sol ON observaciones(id_clave_sol);
UPDATE usuarios SET turno_nombre='Completo',turno_inicio='00:00',turno_fin='23:59' WHERE id IN (SELECT id_usuario FROM usuario_rol WHERE modulo='sunat' AND rol='empleado') AND turno_inicio IS NULL;
