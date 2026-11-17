import {S3Client,PutObjectCommand,GetObjectCommand,HeadObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {randomUUID} from 'node:crypto';
import {AppError} from '../utils/AppError.js';
function client(){if(!process.env.S3_BUCKET||!process.env.S3_ENDPOINT||!process.env.S3_ACCESS_KEY_ID||!process.env.S3_SECRET_ACCESS_KEY)throw new AppError(503,'La carga de imágenes no está disponible.');return new S3Client({endpoint:process.env.S3_ENDPOINT,region:process.env.S3_REGION||'auto',credentials:{accessKeyId:process.env.S3_ACCESS_KEY_ID,secretAccessKey:process.env.S3_SECRET_ACCESS_KEY},forcePathStyle:true});}
export async function uploadUrl(id,tipo){const key=`funciones/${id}/${randomUUID()}`;return {key,url:await getSignedUrl(client(),new PutObjectCommand({Bucket:process.env.S3_BUCKET,Key:key,ContentType:tipo}),{expiresIn:300})};}
export async function readUrl(key){return getSignedUrl(client(),new GetObjectCommand({Bucket:process.env.S3_BUCKET,Key:key}),{expiresIn:600});}
export async function verifyImage(key){const meta=await client().send(new HeadObjectCommand({Bucket:process.env.S3_BUCKET,Key:key}));if(!['image/jpeg','image/png','image/webp'].includes(meta.ContentType)||meta.ContentLength>5*1024*1024)throw new AppError(400,'La imagen debe ser JPG, PNG o WebP de hasta 5 MB.');}
