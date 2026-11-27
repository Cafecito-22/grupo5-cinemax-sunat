import React from 'react';

import {date,useLoad,Load,Title} from '../../components/Shared.jsx';
export function Auditoria(){const state=useLoad('/admin/auditoria');return <><Title eyebrow="JEFATURA" title="Actividad del sistema" sub="Consulta las acciones registradas y sus responsables."/><section className="surface"><Load state={state}>{rows=><div className="table-responsive"><table className="table sunat-table"><thead><tr><th>Fecha</th><th>Responsable</th><th>Acción</th><th>Registro</th></tr></thead><tbody>{rows.map(a=><tr key={a.id}><td>{date(a.fecha)}</td><td>{a.actor||'Sistema'}</td><td>{a.accion}</td><td>{a.entidad} #{a.entidad_id}</td></tr>)}</tbody></table></div>}</Load></section></>;}
