import test from 'node:test';
import assert from 'node:assert/strict';
import {dentroTurno} from '../src/security.js';
test('el turno de Lima incluye el inicio y excluye el final',()=>{
 assert.equal(dentroTurno('08:00:00','16:00:00',new Date('2026-11-23T13:00:00Z')),true);
 assert.equal(dentroTurno('08:00:00','16:00:00',new Date('2026-11-23T21:00:00Z')),false);
});
test('el turno nocturno cruza medianoche sin autorizar la tarde',()=>{
 assert.equal(dentroTurno('22:00','06:00',new Date('2026-11-24T04:00:00Z')),true);
 assert.equal(dentroTurno('22:00','06:00',new Date('2026-11-24T10:59:00Z')),true);
 assert.equal(dentroTurno('22:00','06:00',new Date('2026-11-24T11:00:00Z')),false);
 assert.equal(dentroTurno('22:00','06:00',new Date('2026-11-24T20:00:00Z')),false);
});
test('un turno ausente o de duración cero no concede acceso',()=>{
 assert.equal(dentroTurno(null,null),false);
 assert.equal(dentroTurno('08:00','08:00'),false);
});
