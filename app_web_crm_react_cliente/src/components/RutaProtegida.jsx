import React,{useContext} from 'react';
import {Navigate} from 'react-router-dom';

import {Auth} from '../context/AuthContext.jsx';
import {rol} from './Shared.jsx';
export function Private({children,roles}){const {user}=useContext(Auth);return !user?<Navigate to="/login" replace/>:roles&&!roles.includes(rol(user))?<Navigate to="/cuenta" replace/>:children;}
