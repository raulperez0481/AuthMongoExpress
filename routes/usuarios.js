import express from "express";
import db from "./db.js";

const router = express.Router();


// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
    const error = req.query.error; // Capturamos el mensaje de error en caso de que se haya pasado como parámetro
    res.render('login', { error }); // Pasamos el mensaje de error como variable a la vista login.ejs
  });

router.post('/login', (req, res) => {
const { user, pass } = req.body;
findUser( user, pass, (err, user) => {
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
    db.collection('usuarios').findOne({ user }, (err, user) => {
      if (err) {
        callback(err, null);
      } else if (!user) {
        callback(null, null);
      } else {
        bcrypt.compare(pass, user.pass, (err, res) => {
          if (err) {
            callback(err, null);
          } else if (res) {
            callback(null, user);
          } else {
            callback(null, null);
          }
        });
      }
    });
  }
  
module.exports = router;