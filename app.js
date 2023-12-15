import express from "express";

const app = express();



app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configurar la carpeta 'views' como carpeta de vistas
app.set('views', __dirname + '/views');


const usuarios = require('./routes/usuarios');
app.use('/usuarios', usuarios);



app.listen(3000, ()=>{
  console.log('Servidor levantado en el puerto 3000');
});