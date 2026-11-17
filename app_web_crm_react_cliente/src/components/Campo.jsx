import React,{useState,useEffect,useContext} from 'react';
import {BrowserRouter,Routes,Route,NavLink,Navigate,useNavigate} from 'react-router-dom';
export function Field({label,name,type='text',value,onChange,required=true,...rest}){return <div className="mb-3"><label className="form-label" htmlFor={name}>{label}</label><input id={name} name={name} type={type} className="form-control" required={required} value={value} onChange={onChange} {...rest}/></div>;}
