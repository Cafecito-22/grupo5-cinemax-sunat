import {z} from 'zod';
import {transaction} from '../config/db.js';
import {comprarCore} from './compra-core.js';
import {documentoValido,totalCentimos} from '../utils/comprobante.js';
export const compraSchema=z.object({id_funcion:z.number().int().positive(),id_emisor:z.number().int().positive(),asientos:z.array(z.string().regex(/^[A-F][1-8]$/)).min(1).max(8),tipo_comprobante:z.enum(['boleta','factura']),doc_cliente:z.string(),idempotency_key:z.uuid(),comentario:z.string().trim().max(500).default('')}).superRefine((v,ctx)=>{if(!documentoValido(v.tipo_comprobante,v.doc_cliente))ctx.addIssue({code:'custom',message:'Documento inválido'});if(new Set(v.asientos).size!==v.asientos.length)ctx.addIssue({code:'custom',message:'Asientos repetidos'});});
export async function comprar(user,input,{actor=user}={}){const d=compraSchema.parse(input);return transaction(db=>comprarCore(db,user,d,actor));}
