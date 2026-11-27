import {pool} from '../config/db.js';
export const compartidoQuery1=(values=[],parts=[],db=pool)=>db.query('INSERT INTO auditoria(id_usuario,accion,entidad,entidad_id,detalle) VALUES($1,$2,$3,$4,$5)',values);
export const compartidoQuery2=(values=[],parts=[],db=pool)=>db.query(`SELECT * FROM solicitudes_clave_sol WHERE id=$1 AND eliminado=false${parts[0]}`,values);
