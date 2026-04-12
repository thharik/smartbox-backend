require('dotenv').config();
const{Pool}=require('pg');
const p=new Pool({host:process.env.DB_HOST,port:Number(process.env.DB_PORT),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,ssl:{rejectUnauthorized:false}});
p.query("SELECT id, titulo, tipo FROM conteudos").then(r=>{console.log(r.rows);p.end()}).catch(e=>{console.error(e);p.end()});
