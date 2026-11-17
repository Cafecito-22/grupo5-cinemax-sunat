import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
export function Title({app='CineMax',title,sub}){return <><div className="breadcrumb-text">{app} / {title}</div><div className="eyebrow">{app==='SUNAT'?'Servicios al contribuyente':'Más cerca de tu próxima historia'}</div><h1>{title}</h1>{sub&&<p className="subtitle">{sub}</p>}</>;}
