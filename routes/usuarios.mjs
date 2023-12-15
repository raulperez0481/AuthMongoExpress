import express from "express";
import db from "../db.mjs";

const router = express.Router();


// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
    const error = req.query.error; // Capturamos el mensaje de error en caso de que se haya pasado como parámetro
    res.render('login', { error }); // Pasamos el mensaje de error como variable a la vista login.ejs
  });


  router.post('/login', (req, res) => {
    const { user, pass } = req.body;
    findUser(user, pass, (err, user) => {
      if (err) {
        res.status(500).send('Error al buscar el usuario');
      } else if (!user) {
        res.redirect('/usuarios/login?error=Nombre de usuario o contraseña incorrectos');    
      } else {        
        res.redirect('/usuarios/gestion');
      }
    });
  });

router.get('/gestion',(req, res) => {
    res.render('gestion');
});


function findUser(user, pass, callback) {
    console.log(user);
    db.collection('usuarios').findOne({ user,pass }, (err, coincidencia) => {
        console.log(coincidencia);
      if (err) {
        callback(err, null);
      } else if (!coincidencia) {
        callback(null, null);
      } else {      
        callback(null, coincidencia);     
      }
    });
  }

  
export default router;  // Exportar el router por defecto