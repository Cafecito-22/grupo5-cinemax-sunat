import React from 'react';
export const Status=({value})=><span className={'pill '+String(value).replaceAll(' ','-')}>{value}</span>;
