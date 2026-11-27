import React,{useContext} from 'react';
import {NavLink} from 'react-router-dom';
import {setToken} from '../api.js';
import {Icon} from '../Animation.jsx';

import {Outlet} from 'react-router-dom';
import {Auth} from '../context/AuthContext.jsx';
import {rol,isStaff} from './Shared.jsx';

export function AccountShell(){const {user,setUser}=useContext(Auth);const staff=isStaff(user);const nav=[['/cuenta','Resumen','chart'],['/solicitudes',staff?'Solicitudes':'Mis solicitudes','document'],...(!staff?[['/solicitudes/nueva','Nueva solicitud','key']]:[]),['/comprobantes','Comprobantes','document'],...(staff?[['/fiscalizacion','Fiscalización','chart']]:[]),['/observaciones','Observaciones','search'],['/atencion','Atención digital','mail'],...(rol(user)==='administrador'?[['/conexiones','Sistemas conectados','shield']]:[]),...(rol(user)==='administrador'?[['/usuarios','Usuarios y turnos','user'],['/auditoria','Actividad','clock']]:[]),['/perfil','Mi perfil','user']];return <div className="account-area"><div className="container account-grid"><aside className="account-sidebar"><div className="account-identity"><span className="avatar">{user.nombre.charAt(0)}</span><strong>{user.nombre}</strong><small>{rol(user)==='administrador'?'Jefatura':staff?'Trabajador':'Contribuyente'}</small></div><nav aria-label="Mi cuenta">{nav.map(([to,title,icon])=><NavLink key={to} to={to} end><Icon name={icon} size={18}/>{title}</NavLink>)}</nav><button className="logout" onClick={()=>{setToken(null);setUser(null);}}><Icon name="logout" size={17}/> Cerrar sesión</button></aside><div className="account-content"><Outlet/></div></div></div>;}
