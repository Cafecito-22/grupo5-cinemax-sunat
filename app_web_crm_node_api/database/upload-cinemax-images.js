import 'dotenv/config';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {S3Client,PutObjectCommand} from '@aws-sdk/client-s3';
import {pool} from '../src/config/db.js';
import {peliculasOriginales} from './seed-cinemax.js';
const folder=process.argv[2];if(!folder)throw new Error('Indica la carpeta img del ZIP original.');
if(!process.env.S3_ENDPOINT||!process.env.S3_BUCKET||!process.env.S3_ACCESS_KEY_ID||!process.env.S3_SECRET_ACCESS_KEY)throw new Error('Configura Object Storage antes de cargar imágenes.');
const client=new S3Client({endpoint:process.env.S3_ENDPOINT,region:process.env.S3_REGION||'auto',forcePathStyle:true,credentials:{accessKeyId:process.env.S3_ACCESS_KEY_ID,secretAccessKey:process.env.S3_SECRET_ACCESS_KEY}});
for(const p of peliculasOriginales){const key='cinemax/posters/'+p[0]+'.jpg';await client.send(new PutObjectCommand({Bucket:process.env.S3_BUCKET,Key:key,ContentType:'image/jpeg',Body:await readFile(path.resolve(folder,p[7]))}));await pool.query('UPDATE peliculas SET imagen_key=$1 WHERE clave=$2',[key,p[0]]);}
console.log('Ocho imágenes cargadas en Object Storage; referencias actualizadas.');await pool.end();
