import {pool} from '../config/db.js';
export const postComprobantesQuery1=(values=[],parts=[],db=pool)=>db.query("SELECT * FROM solicitudes_clave_sol WHERE id=$1 AND id_usuario=$2 AND estado='aprobada' AND eliminado=false FOR UPDATE",values);
export const postComprobantesQuery2=(values=[],parts=[],db=pool)=>db.query('SELECT * FROM compras_entradas_cine WHERE id=$1 FOR UPDATE',values);
export const postComprobantesQuery3=(values=[],parts=[],db=pool)=>db.query("SELECT nextval('comprobante_seq') n",values);
export const postComprobantesQuery4=(values=[],parts=[],db=pool)=>db.query('UPDATE compras_entradas_cine SET id_clave_sol=$1,numero_comprobante=$2 WHERE id=$3 RETURNING *',values);
export const postIntegracionTokenQuery1=(values=[],parts=[],db=pool)=>db.query("SELECT * FROM solicitudes_clave_sol WHERE id=$1 AND estado='aprobada' AND eliminado=false",values);
export const postIntegracionTokenQuery2=(values=[],parts=[],db=pool)=>db.query('INSERT INTO integracion_tokens(jti,id_usuario,id_clave_sol,expira_en) VALUES($1,$2,$3,$4)',values);
export const getIntegracionTokensQuery1=(values=[],parts=[],db=pool)=>db.query('SELECT jti,id_clave_sol,expira_en,revocado,creado_en FROM integracion_tokens ORDER BY creado_en DESC LIMIT 50',values);
export const deleteIntegracionTokensJtiQuery1=(values=[],parts=[],db=pool)=>db.query('UPDATE integracion_tokens SET revocado=true WHERE jti=$1 RETURNING jti',values);
