import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
import {api,setToken} from './api/client.js';
import {Auth} from './context/AuthContext.jsx';
import {Login} from './pages/LoginPage.jsx';
import {Layout} from './components/Layout.jsx';
export function App({portal}){const [user,setUser]=useState(null);const [loading,setLoading]=useState(true);useEffect(()=>{api('/auth/me').then(setUser).catch(()=>setToken(null)).finally(()=>setLoading(false));},[]);return <Auth.Provider value={{user,setUser}}><BrowserRouter>{loading?<div className="empty">Cargando…</div>:<Layout portal={portal}/>}</BrowserRouter></Auth.Provider>;}
