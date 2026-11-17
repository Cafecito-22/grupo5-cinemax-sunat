import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
import {Auth,allowed} from '../context/AuthContext.jsx';
export function Protected({modulo,roles,children}){const {user}=useContext(Auth);return !user?<Navigate to="/login" replace/>:allowed(user,modulo,...roles)?children:<div className="panel"><h2>Acceso restringido</h2><p>Tu cuenta no tiene acceso a esta sección.</p></div>;}
