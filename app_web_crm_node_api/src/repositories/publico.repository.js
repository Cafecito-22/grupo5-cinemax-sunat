import {pool} from '../config/db.js';
export const getSaludQuery1=(values=[],parts=[],db=pool)=>db.query('SELECT 1',values);
export const getImagenesSlugQuery1=(values=[],parts=[],db=pool)=>db.query('SELECT storage_key FROM recursos_publicos WHERE slug=$1',values);
