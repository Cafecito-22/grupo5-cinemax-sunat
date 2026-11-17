import 'dotenv/config';
import pg from 'pg';
export const pool = new pg.Pool({connectionString:process.env.DATABASE_URL,max:5});
export async function transaction(fn){const db=await pool.connect();try{await db.query('BEGIN');const result=await fn(db);await db.query('COMMIT');return result;}catch(e){await db.query('ROLLBACK');throw e;}finally{db.release();}}
