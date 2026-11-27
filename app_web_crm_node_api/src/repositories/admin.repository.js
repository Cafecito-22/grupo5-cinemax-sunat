import {pool} from '../config/db.js';
export const getAdminUsuariosQuery1=(values=[],parts=[],db=pool)=>db.query("SELECT u.id,u.nombre,u.correo,u.activo,u.turno_nombre,u.turno_inicio,u.turno_fin,r.rol FROM usuarios u JOIN usuario_rol r ON u.id=r.id_usuario WHERE r.modulo='sunat' ORDER BY u.id",values);
export const getAdminAuditoriaQuery1=(values=[],parts=[],db=pool)=>db.query('SELECT a.*,u.nombre actor FROM auditoria a LEFT JOIN usuarios u ON u.id=a.id_usuario ORDER BY a.id DESC LIMIT 200',values);
export const guardarUsuarioQuery1=(values=[],parts=[],db=pool)=>db.query("SELECT 1 FROM usuario_rol WHERE id_usuario=$1 AND modulo='sunat'",values);
export const guardarUsuarioQuery2=(values=[],parts=[],db=pool)=>db.query('UPDATE usuarios SET nombre=$1,correo=$2,activo=$3,password_hash=COALESCE($4,password_hash),turno_nombre=$5,turno_inicio=$6,turno_fin=$7,session_version=session_version+1 WHERE id=$8',values);
export const guardarUsuarioQuery3=(values=[],parts=[],db=pool)=>db.query('INSERT INTO usuarios(nombre,correo,activo,password_hash,turno_nombre,turno_inicio,turno_fin) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',values);
export const guardarUsuarioQuery4=(values=[],parts=[],db=pool)=>db.query("INSERT INTO usuario_rol VALUES($1,'sunat',$2) ON CONFLICT(id_usuario,modulo) DO UPDATE SET rol=EXCLUDED.rol",values);
