const base=import.meta.env.VITE_API_URL||'http://localhost:3000/api';
let token=sessionStorage.getItem('grupo5-token');
export const setToken=value=>{token=value;if(value)sessionStorage.setItem('grupo5-token',value);else sessionStorage.removeItem('grupo5-token');};
export async function api(path,method='GET',body){const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json().catch(()=>({error:'No se pudo leer la respuesta.'}));if(!response.ok)throw new Error(data.error||'No se pudo completar la operación.');return data;}
