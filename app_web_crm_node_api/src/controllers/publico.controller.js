import {pool} from '../config/db.js';
import {AppError,wrap} from '../utils/AppError.js';

import {S3Client,GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

import * as repo from '../repositories/publico.repository.js';
export const getSalud=wrap(async(req,res)=>{await repo.getSaludQuery1([],[],pool);res.json({ok:true,servicio:'SUNAT Grupo 5',base_datos:'conectada'});});
export const getImagenesSlug=wrap(async(req,res)=>{const r=(await repo.getImagenesSlugQuery1([req.params.slug],[],pool)).rows[0];if(!r)throw new AppError(404,'Imagen no encontrada.');if(!process.env.S3_BUCKET)throw new AppError(503,'La imagen no está disponible.');const s3=new S3Client({endpoint:process.env.S3_ENDPOINT,region:process.env.S3_REGION||'us-east-2',forcePathStyle:true,credentials:{accessKeyId:process.env.S3_ACCESS_KEY_ID,secretAccessKey:process.env.S3_SECRET_ACCESS_KEY}});res.set('Cache-Control','public,max-age=120');res.redirect(await getSignedUrl(s3,new GetObjectCommand({Bucket:process.env.S3_BUCKET,Key:r.storage_key}),{expiresIn:600}));});
