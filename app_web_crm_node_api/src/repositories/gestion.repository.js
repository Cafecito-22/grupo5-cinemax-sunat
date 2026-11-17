import {pool} from '../config/db.js';
export async function ventas(){return (await pool.query("SELECT MIN(s.id) id,s.ruc,s.razon_social,COUNT(c.id)::int comprobantes,COALESCE(SUM(c.monto),0) total FROM solicitudes_clave_sol s LEFT JOIN compras_entradas_cine c ON c.id_clave_sol=s.id AND c.estado='pagado' WHERE s.estado='aprobada' GROUP BY s.ruc,s.razon_social ORDER BY total DESC")).rows;}
