import * as repo from '../repositories/context.repository.js';

import {z} from 'zod';

import {pool} from '../config/db.js';
import {AppError} from '../utils/AppError.js';

import {staff} from '../security.js';
export const origins=(process.env.FRONTEND_ORIGINS||'http://localhost:5173,http://localhost:5174').split(',').map(x=>x.trim());
export const id=req=>z.coerce.number().int().positive().parse(req.params.id);
export const auditoria=(db,u,accion,entidad,entidadId,detalle={})=>repo.compartidoQuery1([u,accion,entidad,entidadId,JSON.stringify(detalle)],[],db);
export const solSchema=z.object({razon_social:z.string().trim().min(3).max(150),ruc:z.string().regex(/^\d{11}$/),representante:z.string().trim().min(3).max(100),correo:z.email().max(200),descripcion:z.string().trim().max(2000).optional()});
export async function propia(req,sid,db=pool,lock=false){const s=(await repo.compartidoQuery2([sid],[lock?' FOR UPDATE':''],db)).rows[0];if(!s||(!staff(req.user)&&s.id_usuario!==req.user.id))throw new AppError(404,'Solicitud no encontrada.');return s;}
export const cred=z.object({correo:z.email().max(200),password:z.string().min(10).max(100)});
