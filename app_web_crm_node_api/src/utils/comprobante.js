export function documentoValido(tipo,documento){return typeof documento==='string'&&(tipo==='boleta'?/^\d{8}$/:tipo==='factura'?/^\d{11}$/:/$a/).test(documento);}
export function totalCentimos(precio,cantidad){if(!Number.isSafeInteger(precio)||precio<=0||!Number.isInteger(cantidad)||cantidad<1||cantidad>8)throw new RangeError('Importe inválido.');return precio*cantidad;}
