ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS turno_nombre TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS turno_inicio TIME;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS turno_fin TIME;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS session_version INT NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS peliculas (
 id SERIAL PRIMARY KEY, clave VARCHAR(80) NOT NULL UNIQUE, titulo VARCHAR(120) NOT NULL,
 genero VARCHAR(60) NOT NULL, duracion INT NOT NULL CHECK(duracion BETWEEN 1 AND 600),
 clasificacion VARCHAR(30) NOT NULL, sala VARCHAR(20) NOT NULL, sinopsis TEXT NOT NULL DEFAULT '',
 imagen_key TEXT, estado TEXT NOT NULL CHECK(estado IN ('cartelera','proximamente','inactiva'))
);
ALTER TABLE funciones ADD COLUMN IF NOT EXISTS id_pelicula INT REFERENCES peliculas(id);
ALTER TABLE compras_entradas_cine ADD COLUMN IF NOT EXISTS codigo_seguimiento TEXT UNIQUE DEFAULT ('CIN-'||upper(substr(md5(random()::text),1,16)));
ALTER TABLE compras_entradas_cine ADD COLUMN IF NOT EXISTS comentario TEXT NOT NULL DEFAULT '';
ALTER TABLE compras_entradas_cine ADD COLUMN IF NOT EXISTS id_empleado INT REFERENCES usuarios(id);
ALTER TABLE compras_entradas_cine ADD COLUMN IF NOT EXISTS estado_entrada TEXT NOT NULL DEFAULT 'registrado' CHECK(estado_entrada IN ('registrado','atendido','cancelado'));
ALTER TABLE compras_entradas_cine ADD COLUMN IF NOT EXISTS id_validador INT REFERENCES usuarios(id);
ALTER TABLE compras_entradas_cine ADD COLUMN IF NOT EXISTS fecha_validacion TIMESTAMPTZ;
