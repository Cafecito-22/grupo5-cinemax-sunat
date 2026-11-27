import {pool} from '../config/db.js';
export const postAuthLoginQuery1=(values=[],parts=[],db=pool)=>db.query('SELECT id,password_hash FROM usuarios WHERE correo=$1 AND activo=true',values);
export const postAuthRegistroQuery1=(values=[],parts=[],db=pool)=>db.query('INSERT INTO usuarios(nombre,correo,password_hash) VALUES($1,$2,$3) RETURNING id',values);
export const postAuthRegistroQuery2=(values=[],parts=[],db=pool)=>db.query("INSERT INTO usuario_rol(id_usuario,modulo,rol) VALUES($1,'sunat','cliente')",values);
