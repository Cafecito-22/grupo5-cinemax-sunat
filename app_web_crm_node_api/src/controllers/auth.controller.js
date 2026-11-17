import bcrypt from 'bcryptjs';
import {verificarTurno} from '../utils/turnos.js';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import {pool,transaction} from '../config/db.js';
import {AppError} from '../utils/AppError.js';
const credentials=z.object({correo:z.email().max(200),password:z.string().min(10).max(100)});
export async function login(req,res){const d=credentials.parse(req.body);const u=(await pool.query('SELECT * FROM usuarios WHERE correo=$1 AND activo=true',[d.correo.toLowerCase()])).rows[0];if(!u||!await bcrypt.compare(d.password,u.password_hash))throw new AppError(401,'Correo o contraseña incorrectos.');const roles=(await pool.query('SELECT modulo,rol FROM usuario_rol WHERE id_usuario=$1',[u.id])).rows;verificarTurno({...u,roles});res.json({token:jwt.sign({v:u.session_version},process.env.JWT_SECRET,{subject:String(u.id),expiresIn:'2h',issuer:'grupo5',audience:'grupo5-web',algorithm:'HS256'}),user:{id:u.id,nombre:u.nombre,correo:u.correo,turno_nombre:u.turno_nombre,turno_inicio:u.turno_inicio,turno_fin:u.turno_fin,roles}});}
export async function registro(req,res){const d=credentials.extend({nombre:z.string().trim().min(3).max(100)}).parse(req.body);const hash=await bcrypt.hash(d.password,12);await transaction(async db=>{const u=(await db.query('INSERT INTO usuarios(nombre,correo,password_hash) VALUES($1,$2,$3) RETURNING id',[d.nombre,d.correo.toLowerCase(),hash])).rows[0];await db.query("INSERT INTO usuario_rol VALUES($1,'cine','cliente'),($1,'sunat','cliente')",[u.id]);});res.status(201).json({ok:true});}
