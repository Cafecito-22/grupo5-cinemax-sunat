import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
import {GestionFunciones} from './GestionFuncionesPage.jsx';
export function Funciones(){return <GestionFunciones/>;}
