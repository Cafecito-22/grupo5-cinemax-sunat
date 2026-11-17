import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
export function Message({error}){return error?<div role="alert" className="alert alert-danger">{error}</div>:null;}
