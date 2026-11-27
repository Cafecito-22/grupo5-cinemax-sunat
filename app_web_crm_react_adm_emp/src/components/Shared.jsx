import {LoadingScene} from './Experience.jsx';
import React,{useEffect,useState} from 'react';

import {API,api} from '../api.js';
import {Icon} from '../Animation.jsx';

export const money=n=>new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN'}).format(Number(n||0));
export const date=d=>d?new Intl.DateTimeFormat('es-PE',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Lima'}).format(new Date(d)):'—';
export const rol=u=>u?.roles?.find(r=>r.modulo==='sunat')?.rol;
export const isStaff=u=>['empleado','administrador'].includes(rol(u));
export function useLoad(path){const [state,set]=useState({loading:true,data:null,error:''});const [v,refresh]=useState(0);useEffect(()=>{let active=true;set(s=>({...s,loading:true,error:''}));api(path).then(data=>active&&set({loading:false,data,error:''})).catch(e=>active&&set({loading:false,data:null,error:e.message}));return()=>{active=false;};},[path,v]);return {...state,reload:()=>refresh(x=>x+1)};}
export function ErrorMessage({text}){return text?<div className="alert alert-danger feedback-enter" role="alert">{text}</div>:null;}
export function Notice({text}){return text?<div className="alert alert-success feedback-enter" role="status"><Icon name="check"/> {text}</div>:null;}
export function Load({state,children}){return state.loading?<LoadingScene/>:state.error?<ErrorMessage text={state.error}/>:children(state.data);}
export function Empty({text='Todavía no hay registros.'}){return <div className="empty-state"><Icon name="document" size={34}/><p>{text}</p></div>;}
export function Asset({name,alt,...props}){const [error,setError]=useState(false);return error?<div className="asset-placeholder"><Icon name="shield" size={60}/></div>:<img src={API+'/publico/imagenes/'+name} alt={alt} onError={()=>setError(true)} {...props}/>;}
export function Field({label,name,children,...props}){return <div className="field"><label htmlFor={'field-'+name}>{label}</label>{children||<input className="form-control" id={'field-'+name} name={name} required {...props}/>}</div>;}
export function Select({label,name,children,...props}){return <div className="field"><label htmlFor={'field-'+name}>{label}</label><select id={'field-'+name} className="form-select" name={name} {...props}>{children}</select></div>;}
export function Badge({state}){return <span className={'status-badge status-'+String(state).replaceAll(' ','-')}><i/>{state}</span>;}
export function Title({eyebrow='MI CUENTA',title,sub,children}){return <div className="page-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{sub&&<p>{sub}</p>}</div>{children}</div>;}
export function Dialog({title,onClose,children}){const close=React.useRef(null);useEffect(()=>{const prev=document.activeElement,overflow=document.body.style.overflow;document.body.style.overflow='hidden';close.current?.focus();const key=e=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const nodes=close.current?.closest('[role=dialog]')?.querySelectorAll('button:not([disabled]),input,select,textarea,a[href]');if(!nodes?.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}};window.addEventListener('keydown',key);return()=>{document.body.style.overflow=overflow;window.removeEventListener('keydown',key);prev?.focus?.();};},[onClose]);return <div className="dialog-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}><section className="dialog-card" role="dialog" aria-modal="true" aria-label={title}><div className="surface-heading"><h2>{title}</h2><button ref={close} className="close-dialog" aria-label="Cerrar" onClick={onClose}>×</button></div>{children}</section></div>;}
