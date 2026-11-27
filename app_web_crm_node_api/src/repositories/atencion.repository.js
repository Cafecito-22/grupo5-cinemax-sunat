import {pool} from '../config/db.js';
export const getAtencionQuery1=(values=[],parts=[],db=pool)=>db.query(`SELECT c.*,u.nombre,u.correo FROM consultas_atencion c JOIN usuarios u ON u.id=c.id_usuario ${parts[0]} ORDER BY c.id DESC LIMIT 200`,values);
export const postAtencionQuery1=(values=[],parts=[],db=pool)=>db.query('INSERT INTO consultas_atencion(id_usuario,asunto,mensaje) VALUES($1,$2,$3) RETURNING *',values);
export const patchAtencionIdQuery1=(values=[],parts=[],db=pool)=>db.query('UPDATE consultas_atencion SET respuesta=$1,respondido_por=$2,respondido_en=now() WHERE id=$3 RETURNING *',values);
