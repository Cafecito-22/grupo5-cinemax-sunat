import bcrypt from 'bcryptjs';
import {pool} from '../config/db.js';
export async function passwordMatches(value,stored){if(typeof stored!=='string')return false;return /^\$2[aby]\$\d{2}\$/.test(stored)?bcrypt.compare(value,stored):value===stored;}
export async function passwordValue(value,userId=null){if(userId){const {rows}=await pool.query("SELECT 1 FROM usuario_rol WHERE id_usuario=$1 AND modulo='cine'",[userId]);if(rows.length)return bcrypt.hash(value,12);}return value;}
