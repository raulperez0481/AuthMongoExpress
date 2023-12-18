import express from "express";
import db from "../db.mjs";
import bcrypt from "bcrypt";
import session from 'express-session';

const router = express.Router();

router.use(session({
    secret: 'mi-secreto',
    resave: false,
    saveUninitialized: true 
  }));
  
  function requireLogin(req, res, next) {
    if (req.session.user) {
      console.log('ID de sesión:', req.sessionID);
      next();
    } else {
      res.redirect('/usuarios/login?error=DONDE VAS FLIPAO¡¡¡¡¡');
    }
  }

router.get('/login', (req, res) => {
    const error = req.query.error;
    res.render('login', { error });
});

router.post('/login', async (req, res) => {
    try {
        const { user, pass } = req.body;

        // Busca el usuario por nombre de usuario
        const existingUser = await db.collection('usuarios').findOne({ user });

        if (existingUser) {
            // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
            const passwordMatch = await bcrypt.compare(pass, existingUser.pass);

            if (passwordMatch) {
                //inicializo variables de sesion
                req.session.user = {
                    id: existingUser._id,
                    name: existingUser.user
                };
                // Contraseña válida, redirige a la página de gestión
                res.redirect(`/usuarios/gestion`);
            } else {
                // Contraseña incorrecta, redirige con un mensaje de error
                res.redirect('/usuarios/login?error=Nombre de usuario o contraseña incorrectos');
            }
        } else {
            // Usuario no encontrado, redirige con un mensaje de error
            res.redirect('/usuarios/login?error=Nombre de usuario o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect('/usuarios/login');
    });
  });

router.post('/crearUsuario', async (req, res) => {
    try {
        const { user, pass } = req.body;

        // Verifica si el usuario ya existe
        const existingUser = await db.collection('usuarios').findOne({ user});
        console.log("El valor de existingUser es:",existingUser);

        if (existingUser) {
            res.status(400).send('El usuario ya existe');
        } else {
           // Encripta la contraseña antes de almacenarla
           const hashedPassword = await bcrypt.hash(pass, 10);

           // Inserta el nuevo usuario en la base de datos
           const result = await db.collection('usuarios').insertOne({ user, pass: hashedPassword });           
            if(result.acknowledged) {
                res.status(201).send('Usuario creado exitosamente');
            } else {
                res.status(500).send('Error al crear el usuario');
            }
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/gestion', requireLogin, (req, res) => {
    if (req.session.user) {
        const { name } = req.session.user;
        // Renderiza la plantilla 'gestion.ejs' pasando la variable 'username'
        res.render('gestion', { username: name });
    } 
});



export default router;
