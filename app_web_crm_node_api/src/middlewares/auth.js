import jwt from 'jsonwebtoken';
import {verificarTurno} from '../utils/turnos.js';
import {pool} from '../config/db.js';
import {AppError,wrap} from '../utils/AppError.js';
export const auth=wrap(async(req,res,next)=>{let payload;try{payload=jwt.verify((req.headers.authorization||'').replace(/^Bearer /,''),process.env.JWT_SECRET,{algorithms:['HS256'],issuer:'grupo5',audience:'grupo5-web'});}catch{throw new AppError(401,'Inicia sesión para continuar.');}const {rows}=await pool.query('SELECT id,nombre,correo,turno_nombre,turno_inicio,turno_fin,session_version FROM usuarios WHERE id=$1 AND activo=true',[payload.sub]);if(!rows[0])throw new AppError(401,'Sesión no válida.');if(payload.v!==rows[0].session_version)throw new AppError(401,'Inicia sesión nuevamente.');req.user=rows[0];req.user.roles=(await pool.query('SELECT modulo,rol FROM usuario_rol WHERE id_usuario=$1',[req.user.id])).rows;next();});
export const has=(user,modulo,...roles)=>user.roles.some(r=>r.modulo===modulo&&roles.includes(r.rol));
export const requireRol=(modulo,...roles)=>(req,res,next)=>{try{if(!has(req.user,modulo,...roles))throw new AppError(403,'No tienes permiso para esta operación.');if(modulo==='cine')verificarTurno(req.user);next();}catch(e){next(e);}};
