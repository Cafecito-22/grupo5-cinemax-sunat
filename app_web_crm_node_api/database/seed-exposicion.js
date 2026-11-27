import 'dotenv/config';
import {pool,transaction} from '../src/config/db.js';
await transaction(async db=>{
 const employee=(await db.query("SELECT u.id FROM usuarios u JOIN usuario_rol r ON r.id_usuario=u.id WHERE r.modulo='sunat' AND r.rol='empleado' ORDER BY u.id LIMIT 1")).rows[0];
 if(!employee)throw new Error('Se necesita un empleado SUNAT para preparar la exposición.');
 for(let i=1;i<=3;i++){
  const s=(await db.query("SELECT s.* FROM solicitudes_clave_sol s JOIN usuarios u ON u.id=s.id_usuario WHERE u.correo=$1 AND s.estado='aprobada' AND s.eliminado=false ORDER BY s.id LIMIT 1",['contribuyente'+i+'@sunat.test'])).rows[0];
  if(!s)throw new Error('Falta la solicitud aprobada del contribuyente de prueba '+i);
  const codigo='DEMO-SUNAT-'+String(i).padStart(4,'0'),numero='B001-'+String(90000000+i),monto=i*18;
  if(!(await db.query('SELECT 1 FROM compras_entradas_cine WHERE codigo_seguimiento=$1',[codigo])).rowCount){
   const c=(await db.query("INSERT INTO compras_entradas_cine(codigo_seguimiento,id_usuario,id_empleado,nombre_cliente,correo_cliente,pelicula,funcion_horario,sala,fecha_funcion,cantidad,comentario,precio_unitario,total_venta,estado,tipo_comprobante,doc_cliente,id_clave_sol,numero_comprobante,id_emisor,monto,fecha) VALUES($1,$2,$3,$4,$5,$6,'18:00','DEMO SUNAT',CURRENT_DATE,$7,$8,18,$9,'atendido','boleta','00000001',$10,$11,$2,NULL,now()) RETURNING id",[codigo,s.id_usuario,employee.id,'Contribuyente de demostración '+i,'contribuyente'+i+'@sunat.test','Demostración académica SUNAT',i,'Registro ficticio para exposición; no corresponde a una venta real.',monto,s.id,numero])).rows[0];
   await db.query("INSERT INTO auditoria(id_usuario,accion,entidad,entidad_id,detalle) VALUES($1,'crear','compra',$2,$3)",[employee.id,c.id,JSON.stringify({origen:'demostracion_sunat',ficticio:true})]);
  }
  const detalle='Demostración académica: comprobante '+numero+' revisado para fiscalización.';
  await db.query('INSERT INTO observaciones(id_clave_sol,id_usuario,detalle) SELECT $1,$2,$3 WHERE NOT EXISTS(SELECT 1 FROM observaciones WHERE id_clave_sol=$1 AND detalle=$3)',[s.id,employee.id,detalle]);
 }
});
await pool.end();
console.log('Tres comprobantes ficticios enlazados con solicitudes aprobadas y observaciones, sin duplicar registros.');
