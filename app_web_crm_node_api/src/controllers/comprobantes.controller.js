import {pool} from '../config/db.js';
import {wrap} from '../utils/AppError.js';

import {staff} from '../security.js';

import {z} from 'zod';

import {id,propia} from '../services/context.js';
import * as repo from '../repositories/comprobantes.repository.js';
export const getResumen=wrap(async(req,res)=>{const all=staff(req.user);const p=all?[]:[req.user.id];const where=all?'eliminado=false':'eliminado=false AND id_usuario=$1';const estados=(await repo.getResumenQuery1(p,[where],pool)).rows;const ventas=(await repo.getResumenQuery2(p,[all?'':'WHERE s.id_usuario=$1'],pool)).rows[0];res.json({estados,...ventas});});
export const getComprobantes=wrap(async(req,res)=>res.json((await repo.getComprobantesQuery1(staff(req.user)?[]:[req.user.id],[staff(req.user)?'':'WHERE s.id_usuario=$1'],pool)).rows));
export const getFiscalizacion=wrap(async(req,res)=>res.json((await repo.getFiscalizacionQuery1([],[],pool)).rows));
export const getObservaciones=wrap(async(req,res)=>res.json((await repo.getObservacionesQuery1(staff(req.user)?[]:[req.user.id],[staff(req.user)?'':'WHERE s.id_usuario=$1'],pool)).rows));
export const postObservaciones=wrap(async(req,res)=>{const d=z.object({id_clave_sol:z.number().int().positive(),detalle:z.string().trim().min(5).max(2000)}).parse(req.body);await propia(req,d.id_clave_sol);res.status(201).json((await repo.postObservacionesQuery1([d.id_clave_sol,req.user.id,d.detalle],[],pool)).rows[0]);});
