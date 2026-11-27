import {pool} from '../config/db.js';
export const seguridadQuery1=(values=[],parts=[],db=pool)=>db.query('SELECT id,nombre,correo,activo,turno_nombre,turno_inicio,turno_fin,session_version FROM usuarios WHERE id=$1 AND activo=true',values);
export const seguridadQuery2=(values=[],parts=[],db=pool)=>db.query('SELECT modulo,rol FROM usuario_rol WHERE id_usuario=$1',values);
export const seguridadQuery3=(values=[],parts=[],db=pool)=>db.query("SELECT t.*,s.ruc,s.razon_social,s.estado,s.eliminado FROM integracion_tokens t JOIN solicitudes_clave_sol s ON s.id=t.id_clave_sol WHERE t.jti=$1 AND t.id_usuario=$2 AND t.revocado=false AND t.expira_en>now()",values);
