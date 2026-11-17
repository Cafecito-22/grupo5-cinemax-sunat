import {carteleraOriginal} from '../data/cartelera.js';
import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
import {api} from '../api/client.js';
export function useLoad(path){const [state,set]=useState({data:null,error:'',loading:true});const [version,refresh]=useState(0);useEffect(()=>{let active=true;set({data:null,error:'',loading:true});api(path).then(data=>active&&set({data,error:'',loading:false})).catch(e=>active&&set(path==='/peliculas'?{data:carteleraOriginal,error:'',loading:false}:{data:null,error:e.message,loading:false}));return()=>{active=false;};},[path,version]);return {...state,reload:()=>refresh(n=>n+1)};}
