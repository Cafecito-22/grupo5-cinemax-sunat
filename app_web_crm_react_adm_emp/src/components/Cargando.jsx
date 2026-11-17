import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
import {Message} from './Mensaje.jsx';
export function Loading({state,children}){if(state.loading)return <div className="panel" role="status">Cargando…</div>;if(state.error)return <Message error={state.error}/>;return children(state.data);}
