import {pool} from '../config/db.js';
import {AppError,wrap} from '../utils/AppError.js';

import bcrypt from 'bcryptjs';

import {z} from 'zod';

import {id} from '../services/context.js';
import * as repo from '../repositories/perfil.repository.js';
export const putPerfil=wrap(async(req,res)=>{const d=z.object({nombre:z.string().trim().min(3).max(100),correo:z.email(),actual:z.string().min(1).max(100),nueva:z.string().min(10).max(100).optional()}).parse(req.body);const hash=(await repo.putPerfilQuery1([req.user.id],[],pool)).rows[0].password_hash;if(!await bcrypt.compare(d.actual,hash))throw new AppError(403,'La contraseña actual no es correcta.');await repo.putPerfilQuery2([d.nombre,d.correo.toLowerCase(),d.nueva?await bcrypt.hash(d.nueva,12):null,req.user.id],[],pool);res.json({ok:true,reingresar:true});});
