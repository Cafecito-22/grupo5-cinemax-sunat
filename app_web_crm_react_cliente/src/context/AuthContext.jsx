import {createContext} from 'react';
export const Auth=createContext(null);
export const allowed=(u,m,...roles)=>u?.roles?.some(r=>r.modulo===m&&roles.includes(r.rol));
