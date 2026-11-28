import {pool,transaction} from '../config/db.js';
import {AppError,wrap} from '../utils/AppError.js';

import {role,firmar,usuario,exigirTurno} from '../security.js';
import {passwordMatches,passwordValue} from '../services/password.js';

import {z} from 'zod';

import {id,cred} from '../services/context.js';
import * as repo from '../repositories/auth.repository.js';
export const postAuthLogin=wrap(async(req,res)=>{const d=cred.parse(req.body);const u=(await repo.postAuthLoginQuery1([d.correo.toLowerCase()],[],pool)).rows[0];if(!u||!await passwordMatches(d.password,u.password_hash))throw new AppError(401,'Correo o contraseña incorrectos.');const user=await usuario(u.id);if(!role(user))throw new AppError(403,'Tu cuenta no tiene acceso a SUNAT.');exigirTurno(user);res.json({token:firmar(user),user});});
export const postAuthRegistro=wrap(async(req,res)=>{const d=cred.extend({nombre:z.string().trim().min(3).max(100)}).parse(req.body);const hash=await passwordValue(d.password);const uid=await transaction(async db=>{const u=(await repo.postAuthRegistroQuery1([d.nombre,d.correo.toLowerCase(),hash],[],db)).rows[0];await repo.postAuthRegistroQuery2([u.id],[],db);return u.id;});const user=await usuario(uid);res.status(201).json({ok:true,user,token:firmar(user)});});
export const getAuthMe=(req,res)=>res.json(req.user);
export const getAuthValidar=(req,res)=>res.json({valido:true,user:req.user});
