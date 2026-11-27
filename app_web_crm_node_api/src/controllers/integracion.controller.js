import {pool,transaction} from '../config/db.js';
import {AppError,wrap} from '../utils/AppError.js';
import {documentoValido} from '../utils/comprobante.js';
import {usuario,integracion} from '../security.js';

import jwt from 'jsonwebtoken';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';

import {id,auditoria} from '../services/context.js';
import * as repo from '../repositories/integracion.repository.js';
export const getValidar=(req,res)=>{const t=req.integracion;res.json({valido:true,emision_habilitada:true,id_usuario:t.id_usuario,id_clave_sol:t.id_clave_sol,ruc:t.ruc,razon_social:t.razon_social,expira_en:t.expira_en});};
export const postComprobantes=wrap(async(req,res)=>{const compraId=z.number().int().positive().parse(req.body.id_compra);const t=req.integracion;const r=await transaction(async db=>{const sol=(await repo.postComprobantesQuery1([t.id_clave_sol,t.id_usuario],[],db)).rows[0];if(!sol)throw new AppError(403,'La clave SOL ya no está habilitada.');const c=(await repo.postComprobantesQuery2([compraId],[],db)).rows[0];if(!c||c.id_emisor!==t.id_usuario)throw new AppError(404,'Compra no encontrada para este emisor.');if(!['pagado','atendido'].includes(c.estado))throw new AppError(409,'La compra no está pagada.');if(!documentoValido(c.tipo_comprobante,c.doc_cliente))throw new AppError(400,'El documento de la compra no es válido.');if(c.numero_comprobante){if(c.id_clave_sol!==sol.id)throw new AppError(409,'La compra ya está vinculada a otra clave SOL.');return {...c,reutilizado:true};}const n=(await repo.postComprobantesQuery3([],[],db)).rows[0].n;const numero=(c.tipo_comprobante==='factura'?'F001-':'B001-')+String(n).padStart(8,'0');const row=(await repo.postComprobantesQuery4([sol.id,numero,c.id],[],db)).rows[0];await auditoria(db,t.id_usuario,'emitir','compra',c.id,{numero});return row;});res.status(r.reutilizado?200:201).json(r);});
export const postIntegracionToken=wrap(async(req,res)=>{const sid=z.number().int().positive().parse(req.body.id_clave_sol);const s=(await repo.postIntegracionTokenQuery1([sid],[],pool)).rows[0];if(!s)throw new AppError(403,'Selecciona una clave SOL aprobada.');const jti=randomUUID(),expira=new Date(Date.now()+900000);await repo.postIntegracionTokenQuery2([jti,s.id_usuario,s.id,expira],[],pool);res.status(201).json({token:jwt.sign({jti,proposito:'emitir-comprobantes',gestor:req.user.id,v:(await usuario(s.id_usuario)).session_version},process.env.JWT_SECRET,{subject:String(s.id_usuario),expiresIn:'15m',issuer:'grupo5-sunat',audience:'grupo5-integracion',algorithm:'HS256'}),tipo:'Bearer',expira_en:expira,jti});});
export const getIntegracionTokens=wrap(async(req,res)=>res.json((await repo.getIntegracionTokensQuery1([],[],pool)).rows));
export const deleteIntegracionTokensJti=wrap(async(req,res)=>{const jti=z.uuid().parse(req.params.jti);const r=await repo.deleteIntegracionTokensJtiQuery1([jti],[],pool);if(!r.rowCount)throw new AppError(404,'Token no encontrado.');res.json({ok:true});});
