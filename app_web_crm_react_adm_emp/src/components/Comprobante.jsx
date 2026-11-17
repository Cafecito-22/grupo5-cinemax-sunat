import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
import {money,date} from '../utils/formato.js';
import {Status} from './Estado.jsx';
import {Compra} from '../pages/CompraPage.jsx';
export function Ticket({compra:c}){return <article className="ticket"><div className="d-flex justify-content-between"><strong>{c.numero_comprobante||'Compra #'+c.id}</strong><Status value={c.numero_comprobante?'emitida':'sin comprobante'}/></div><p className="mt-3"><strong>{c.codigo_seguimiento}</strong></p><h2 className="mt-3">{c.titulo}</h2><p>{c.funcion_fecha&&date(c.funcion_fecha)} · {c.sala} · Asientos {c.asientos.join(', ')}</p><p className="mb-0">{c.tipo_comprobante} · {c.doc_cliente} <strong className="float-end">{money(c.monto)}</strong></p></article>;}
