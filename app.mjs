// app.mjs
import express from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configurar la carpeta 'views' como carpeta de vistas
const viewsPath = join(__dirname, 'views');
app.set('views', viewsPath);

// Importar el módulo usuarios como un módulo ES
import usuarios from './routes/usuarios.mjs'; // Asegúrate de incluir la extensión .js
app.use('/usuarios', usuarios);

app.listen(3000, () => {
  console.log('Servidor levantado en el puerto 3000');
});
