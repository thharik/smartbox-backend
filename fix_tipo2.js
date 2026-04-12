require('dotenv').config();
const{Pool}=require('pg');
const p=new Pool({host:process.env.DB_HOST,port:Number(process.env.DB_PORT),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,ssl:{rejectUnauthorized:false}});
p.query("UPDATE conteudos SET tipo='Manga' WHERE id IN ('konjiki_no_gash_2','soul_eater')").then(r=>{console.log('OK:',r.rowCount);p.end()}).catch(e=>{console.error(e);p.end()});
