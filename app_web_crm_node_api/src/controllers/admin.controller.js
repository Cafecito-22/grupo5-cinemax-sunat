import {pool,transaction} from '../config/db.js';
import {AppError,wrap} from '../utils/AppError.js';

import bcrypt from 'bcryptjs';

import {z} from 'zod';

import {id,auditoria} from '../services/context.js';
import * as repo from '../repositories/admin.repository.js';
const userSchema=z.object({nombre:z.string().trim().min(3).max(100),correo:z.email(),rol:z.enum(['cliente','empleado','administrador']),activo:z.boolean().default(true),password:z.string().min(10).max(100).optional(),turno_nombre:z.string().max(60).nullable().default(null),turno_inicio:z.string().nullable().default(null),turno_fin:z.string().nullable().default(null)}).superRefine((u,c)=>{if(u.rol==='empleado'&&u.turno_nombre!=='Completo'&&(!/^([01]\d|2[0-3]):[0-5]\d$/.test(u.turno_inicio||'')||!/^([01]\d|2[0-3]):[0-5]\d$/.test(u.turno_fin||'')||u.turno_inicio===u.turno_fin))c.addIssue({code:'custom',message:'Indica un turno válido.'});});
async function saveUser(req,res){const d=userSchema.parse(req.body);const uid=req.params.id?id(req):null;if(uid===req.user.id&&(!d.activo||d.rol!=='administrador'))throw new AppError(409,'No puedes quitarte el acceso de jefatura.');if(!uid&&!d.password)throw new AppError(400,'Define una contraseña inicial.');const hash=d.password?await bcrypt.hash(d.password,12):null;await transaction(async db=>{let target=uid;if(uid){if(!(await repo.guardarUsuarioQuery1([uid],[],db)).rowCount)throw new AppError(404,'Usuario no encontrado.');await repo.guardarUsuarioQuery2([d.nombre,d.correo.toLowerCase(),d.activo,hash,d.turno_nombre,d.turno_inicio,d.turno_fin,uid],[],db);}else target=(await repo.guardarUsuarioQuery3([d.nombre,d.correo.toLowerCase(),d.activo,hash,d.turno_nombre,d.turno_inicio,d.turno_fin],[],db)).rows[0].id;await repo.guardarUsuarioQuery4([target,d.rol],[],db);await auditoria(db,req.user.id,uid?'actualizar':'crear','usuario',target);});res.status(uid?200:201).json({ok:true});}
export const getAdminUsuarios=wrap(async(req,res)=>res.json((await repo.getAdminUsuariosQuery1([],[],pool)).rows));
export const postAdminUsuarios=wrap(saveUser);
export const putAdminUsuariosId=wrap(saveUser);
export const getAdminAuditoria=wrap(async(req,res)=>res.json((await repo.getAdminAuditoriaQuery1([],[],pool)).rows));
