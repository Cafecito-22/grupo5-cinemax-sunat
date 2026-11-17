export const peliculasOriginales=[
 ['silencio','El Origen del Silencio','Suspenso',118,'+14','Sala 1','cartelera','im2.jpg'],
 ['ruta65','Ruta 65','Acción',132,'+14','Sala 2','cartelera','im3.jpg'],
 ['carton','Mundo de Cartón','Animación',95,'Todo público','Sala 3','cartelera','im4.jpg'],
 ['luna','Bajo la Misma Luna','Drama',110,'+14','Sala 4','cartelera','im1.jpg'],
 ['ventana','A través de mi ventana','Romance',118,'+14','Sala 1','proximamente','im5.jpg'],
 ['dos-caras','A 2 caras','Suspenso',132,'+14','Sala 2','proximamente','im6.jpg'],
 ['wish','Wish','Animación',95,'Todo público','Sala 3','proximamente','im7.jpg'],
 ['no-respires','No respires','Terror',110,'+18','Sala 4','proximamente','im8.jpg']
];
export async function seedCinemax(db){const funciones=[];for(const p of peliculasOriginales){const film=(await db.query('INSERT INTO peliculas(clave,titulo,genero,duracion,clasificacion,sala,estado) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(clave) DO UPDATE SET titulo=EXCLUDED.titulo RETURNING id',p.slice(0,7))).rows[0];if(p[6]!=='cartelera')continue;for(const hora of ['15:30','19:00']){const f=(await db.query("INSERT INTO funciones(titulo,descripcion,sala,fecha,precio_centimos,id_pelicula) VALUES($1,$2,$3,(((now() AT TIME ZONE 'America/Lima')::date+7)+$4::time) AT TIME ZONE 'America/Lima',1800,$5) RETURNING id",[p[1],p[2]+' · '+p[4]+' · '+p[3]+' min',p[5],hora,film.id])).rows[0];funciones.push(f.id);}}return funciones;}
