import 'dotenv/config';
import {readFile} from 'node:fs/promises';
import {pool,transaction} from '../src/config/db.js';
await transaction(async db=>{for(const file of ['schema.sql','sunat.sql'])await db.query(await readFile(new URL(file,import.meta.url),'utf8'));});
await pool.end();console.log('Migración SUNAT aplicada.');
