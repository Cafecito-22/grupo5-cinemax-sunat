import {pool} from '../config/db.js';
import {AppError,wrap} from '../utils/AppError.js';

import {staff} from '../security.js';

import {z} from 'zod';

import {id} from '../services/context.js';
import * as repo from '../repositories/atencion.repository.js';
export const getAtencion=wrap(async(req,res)=>res.json((await repo.getAtencionQuery1(staff(req.user)?[]:[req.user.id],[staff(req.user)?'':'WHERE c.id_usuario=$1'],pool)).rows));
export const postAtencion=wrap(async(req,res)=>{const d=z.object({asunto:z.string().trim().min(3).max(150),mensaje:z.string().trim().min(10).max(3000)}).parse(req.body);res.status(201).json((await repo.postAtencionQuery1([req.user.id,d.asunto,d.mensaje],[],pool)).rows[0]);});
export const patchAtencionId=wrap(async(req,res)=>{const respuesta=z.string().trim().min(5).max(3000).parse(req.body.respuesta);const r=await repo.patchAtencionIdQuery1([respuesta,req.user.id,id(req)],[],pool);if(!r.rowCount)throw new AppError(404,'Consulta no encontrada.');res.json(r.rows[0]);});
