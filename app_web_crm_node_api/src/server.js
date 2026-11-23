import 'dotenv/config';
if(!process.env.DATABASE_URL||!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32)throw new Error('Configura DATABASE_URL y JWT_SECRET.');
const {app}=await import('./app.js');
app.listen(process.env.PORT||3000,()=>console.log('SUNAT API iniciada'));
