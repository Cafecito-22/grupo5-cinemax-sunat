import {AppError} from './AppError.js';
export function dentroTurno(inicio,fin,now=new Date()){
 if(!inicio||!fin)return false;
 const partes=new Intl.DateTimeFormat('en-GB',{timeZone:'America/Lima',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);
 const hora=partes.find(p=>p.type==='hour').value+':'+partes.find(p=>p.type==='minute').value;
 const desde=String(inicio).slice(0,5),hasta=String(fin).slice(0,5);
 return desde<hasta?hora>=desde&&hora<hasta:desde>hasta&&(hora>=desde||hora<hasta);
}
export function verificarTurno(user){if(user.roles.some(r=>r.modulo==='cine'&&r.rol==='empleado')&&!dentroTurno(user.turno_inicio,user.turno_fin))throw new AppError(403,'Estás fuera de turno laboral.');}
