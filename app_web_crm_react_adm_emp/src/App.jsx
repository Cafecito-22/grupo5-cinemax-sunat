import React,{useEffect,useState} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {api,setToken} from './api.js';

import {Auth} from './context/AuthContext.jsx';
import {ScrollTop,Layout} from './layouts/PublicLayout.jsx';
export function App(){const [user,setUser]=useState(null),[loading,setLoading]=useState(true);useEffect(()=>{api('/auth/me').then(setUser).catch(()=>setToken(null)).finally(()=>setLoading(false));},[]);return <Auth.Provider value={{user,setUser}}><BrowserRouter><ScrollTop/><Layout loading={loading}/></BrowserRouter></Auth.Provider>;}
