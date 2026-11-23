import 'dotenv/config';
import bcrypt from 'bcryptjs';
import {pool,transaction} from '../src/config/db.js';
if(!process.env.SEED_PASSWORD||process.env.SEED_PASSWORD.length<12)throw new Error('Define SEED_PASSWORD con al menos 12 caracteres.');
const hash=await bcrypt.hash(process.env.SEED_PASSWORD,12);
await transaction(async db=>{
 async function user(nombre,correo,rol){let u=(await db.query('INSERT INTO usuarios(nombre,correo,password_hash) VALUES($1,$2,$3) ON CONFLICT(correo) DO NOTHING RETURNING id',[nombre,correo,hash])).rows[0];if(!u)u=(await db.query('SELECT id FROM usuarios WHERE correo=$1',[correo])).rows[0];await db.query("INSERT INTO usuario_rol VALUES($1,'sunat',$2) ON CONFLICT DO NOTHING",[u.id,rol]);return u.id;}
 await user('Jefatura SUNAT','jefatura@sunat.test','administrador');const empleado=await user('Trabajador SUNAT','trabajador@sunat.test','empleado');
 await db.query("UPDATE usuarios SET turno_nombre='Completo',turno_inicio='00:00',turno_fin='23:59' WHERE id=$1 AND turno_inicio IS NULL",[empleado]);
 for(let i=1;i<=10;i++){const correo='contribuyente'+i+'@sunat.test';const uid=await user('Contribuyente '+i,correo,'cliente');if((await db.query('SELECT 1 FROM solicitudes_clave_sol WHERE id_usuario=$1 LIMIT 1',[uid])).rowCount)continue;for(let j=0;j<3;j++){const s=(await db.query('INSERT INTO solicitudes_clave_sol(id_usuario,razon_social,ruc,representante,correo,estado) VALUES($1,$2,$3,$4,$5,$6) RETURNING id',[uid,'Empresa '+i+' SAC','20'+String(600000000+i*3+j),'Representante '+i,correo,['registrado','aprobada','rechazado'][j]])).rows[0];await db.query("INSERT INTO auditoria(id_usuario,accion,entidad,entidad_id,detalle) VALUES($1,$2,'solicitud',$3,$4)",[uid,'registrar',s.id,JSON.stringify({origen:'datos de prueba'})]);if(j===2)await db.query('INSERT INTO observaciones(id_clave_sol,id_usuario,detalle) VALUES($1,$2,$3)',[s.id,empleado,'Verifica el documento del representante antes de registrar una nueva solicitud.']);}}
});await pool.end();console.log('Cuentas y solicitudes de prueba SUNAT preparadas sin cambiar contraseñas existentes.');
