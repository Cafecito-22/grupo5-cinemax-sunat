import jwt from 'jsonwebtoken';
import {pool} from './config/db.js';
import {AppError,wrap} from './utils/AppError.js';
export const role=u=>u.roles.find(r=>r.modulo==='sunat')?.rol;
export const staff=u=>['empleado','administrador'].includes(role(u));
export function dentroTurno(inicio,fin,now=new Date()){
 if(!inicio||!fin)return false;
 const hora=new Intl.DateTimeFormat('en-GB',{timeZone:'America/Lima',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);
 const a=String(inicio).slice(0,5),b=String(fin).slice(0,5);
 return a<b?hora>=a&&hora<b:a>b&&(hora>=a||hora<b);
}
export function exigirTurno(u){if(role(u)==='empleado'&&u.turno_nombre!=='Completo'&&!dentroTurno(u.turno_inicio,u.turno_fin))throw new AppError(403,'Estás fuera de tu turno de atención.');}
export async function usuario(id){const u=(await pool.query('SELECT id,nombre,correo,activo,turno_nombre,turno_inicio,turno_fin,session_version FROM usuarios WHERE id=$1 AND activo=true',[id])).rows[0];if(!u)throw new AppError(401,'La sesión ya no está disponible.');u.roles=(await pool.query('SELECT modulo,rol FROM usuario_rol WHERE id_usuario=$1',[id])).rows;return u;}
export const bearer=req=>(req.headers.authorization||'').replace(/^Bearer /,'');
export const auth=wrap(async(req,res,next)=>{let p;try{p=jwt.verify(bearer(req),process.env.JWT_SECRET,{algorithms:['HS256'],issuer:'grupo5',audience:'grupo5-web'});}catch{throw new AppError(401,'Inicia sesión para continuar.');}req.user=await usuario(p.sub);if(p.v!==req.user.session_version)throw new AppError(401,'Inicia sesión nuevamente.');if(!role(req.user))throw new AppError(403,'Tu cuenta no tiene acceso a SUNAT.');exigirTurno(req.user);next();});
export const permitir=(...roles)=>(req,res,next)=>{try{if(!roles.includes(role(req.user)))throw new AppError(403,'No tienes permiso para esta operación.');exigirTurno(req.user);next();}catch(e){next(e);}};
export const firmar=u=>jwt.sign({v:u.session_version},process.env.JWT_SECRET,{subject:String(u.id),expiresIn:'2h',issuer:'grupo5',audience:'grupo5-web',algorithm:'HS256'});
export const integracion=wrap(async(req,res,next)=>{let p;try{p=jwt.verify(bearer(req),process.env.JWT_SECRET,{algorithms:['HS256'],issuer:'grupo5-sunat',audience:'grupo5-integracion'});}catch{throw new AppError(401,'Token de integración no válido o vencido.');}if(p.proposito!=='emitir-comprobantes')throw new AppError(401,'Token de integración no válido.');if(!p.gestor||role(await usuario(p.gestor))!=='administrador')throw new AppError(403,'El acceso debe ser autorizado por jefatura.');const u=await usuario(p.sub);if(p.v!==u.session_version)throw new AppError(401,'El token fue revocado.');const t=(await pool.query("SELECT t.*,s.ruc,s.razon_social,s.estado,s.eliminado FROM integracion_tokens t JOIN solicitudes_clave_sol s ON s.id=t.id_clave_sol WHERE t.jti=$1 AND t.id_usuario=$2 AND t.revocado=false AND t.expira_en>now()",[p.jti,u.id])).rows[0];if(!t||t.estado!=='aprobada'||t.eliminado)throw new AppError(403,'La clave SOL no está aprobada o el token fue revocado.');req.integracion={...t,usuario:u};next();});
