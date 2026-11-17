import {test} from 'node:test';
import assert from 'node:assert/strict';
import {documentoValido,totalCentimos} from './comprobante.js';
test('DNI y RUC: longitud exacta, solo dígitos y tipo conocido',()=>{assert.equal(documentoValido('boleta','70000001'),true);assert.equal(documentoValido('factura','20512345678'),true);for(const [tipo,doc] of [['boleta','20512345678'],['factura','70000001'],['boleta','7000000a'],['otro','70000001'],['boleta',null]])assert.equal(documentoValido(tipo,doc),false);});
test('total conserva céntimos y rechaza cantidades fuera del límite',()=>{assert.equal(totalCentimos(1801,3),5403);for(const n of [0,-1,9,1.1,NaN])assert.throws(()=>totalCentimos(1800,n),RangeError);assert.throws(()=>totalCentimos(-1,2),RangeError);});
