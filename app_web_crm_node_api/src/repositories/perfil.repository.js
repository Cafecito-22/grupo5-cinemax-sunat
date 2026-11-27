import {pool} from '../config/db.js';
export const putPerfilQuery1=(values=[],parts=[],db=pool)=>db.query('SELECT password_hash FROM usuarios WHERE id=$1',values);
export const putPerfilQuery2=(values=[],parts=[],db=pool)=>db.query('UPDATE usuarios SET nombre=$1,correo=$2,password_hash=COALESCE($3,password_hash),session_version=session_version+1 WHERE id=$4',values);
