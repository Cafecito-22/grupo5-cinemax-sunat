import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
import {money} from '../utils/formato.js';
import {Status} from '../components/Estado.jsx';
import {Loading} from '../components/Cargando.jsx';
import {Title} from '../components/Titulo.jsx';
import {useLoad} from '../hooks/useLoad.jsx';
export function Comprobantes(){const state=useLoad('/comprobantes');return <><Title app="SUNAT" title="Comprobantes recibidos"/><Loading state={state}>{data=><div className="panel table-responsive"><table className="table"><thead><tr>{['Comprobante','Emisor','RUC','Documento cliente','Monto','Estado'].map(s=><th key={s}>{s}</th>)}</tr></thead><tbody>{data.map(c=><tr key={c.id}><td>{c.numero_comprobante}</td><td>{c.razon_social}</td><td>{c.ruc}</td><td>{c.doc_cliente}</td><td>{money(c.monto)}</td><td><Status value={c.estado}/></td></tr>)}</tbody></table>{!data.length&&<div className="empty">No hay comprobantes recibidos.</div>}</div>}</Loading></>;}
