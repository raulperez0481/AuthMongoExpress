import express from "express";
import db from "../db.mjs";

const router = express.Router();

router.get('/login', (req, res) => {
    const error = req.query.error;
    res.render('login', { error });
});

router.post('/login', async(req, res) => {
    
    try {
      const { user, pass } = req.body;

      // Verifica si el usuario ya existe
      const existingUser = await db.collection('usuarios').findOne({ user, pass });
      console.log("El valor de existingUser es:",existingUser);

      if(existingUser) {
        res.redirect('/usuarios/gestion');
      } else {
      res.redirect('/usuarios/login?error=Nombre de usuario o contraseña incorrectos');
      }
    }
       catch (error) {   
        res.status(500).send('Error al buscar el usuario',error);   
    }
});

router.post('/crearUsuario', async (req, res) => {
    try {
        const { user, pass } = req.body;

        // Verifica si el usuario ya existe
        const existingUser = await db.collection('usuarios').findOne({ user, pass });
        console.log("El valor de existingUser es:",existingUser);

        if (existingUser) {
            res.status(400).send('El usuario ya existe');
        } else {
            const result = await db.collection('usuarios').insertOne({ user, pass });
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

router.get('/gestion', (req, res) => {
    res.render('gestion');
});



export default router;
