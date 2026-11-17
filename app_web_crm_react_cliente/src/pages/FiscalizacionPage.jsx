import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
import {money} from '../utils/formato.js';
import {Loading} from '../components/Cargando.jsx';
import {Title} from '../components/Titulo.jsx';
import {useLoad} from '../hooks/useLoad.jsx';
import {Comprobantes} from './ComprobantesPage.jsx';
export function Fiscalizacion(){const state=useLoad('/fiscalizacion');return <><Title app="SUNAT" title="Fiscalización" sub="Ventas declaradas por contribuyente."/><Loading state={state}>{data=><><div className="hero-strip"><div><span>Total vendido</span><h1>{money(data.reduce((n,r)=>n+Number(r.total),0))}</h1></div><div><strong>{data.reduce((n,r)=>n+r.comprobantes,0)}</strong> comprobantes</div></div><div className="panel table-responsive"><table className="table"><thead><tr><th>Contribuyente</th><th>RUC</th><th>Comprobantes</th><th>Total</th></tr></thead><tbody>{data.map(r=><tr key={r.id}><td>{r.razon_social}</td><td>{r.ruc}</td><td>{r.comprobantes}</td><td><strong>{money(r.total)}</strong></td></tr>)}</tbody></table>{!data.length&&<div className="empty">No hay contribuyentes habilitados.</div>}</div></>}</Loading></>;}
