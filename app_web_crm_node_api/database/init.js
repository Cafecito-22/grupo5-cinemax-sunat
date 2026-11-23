import 'dotenv/config';
import {readFile} from 'node:fs/promises';
import {pool,transaction} from '../src/config/db.js';
await transaction(async db=>{await db.query(await readFile(new URL('./sunat.sql',import.meta.url),'utf8'));});
await pool.end();console.log('Migración SUNAT aplicada.');
