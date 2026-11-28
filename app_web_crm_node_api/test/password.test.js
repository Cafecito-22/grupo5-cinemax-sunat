import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import {passwordMatches,passwordValue} from '../src/services/password.js';
test('SUNAT conserva el texto y verifica la contraseña exacta',async()=>{const value=await passwordValue('123456789@');assert.equal(value,'123456789@');assert.equal(await passwordMatches('123456789@',value),true);assert.equal(await passwordMatches('123456789',value),false);assert.equal(await passwordMatches('123456789@',null),false);});
test('las cuentas con bcrypt siguen admitiendo su contraseña anterior',async()=>{const value=await bcrypt.hash('prueba-compatibilidad',4);assert.equal(await passwordMatches('prueba-compatibilidad',value),true);assert.equal(await passwordMatches('incorrecta',value),false);});
