import express from 'express';
import usuariosRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'


// Crear la app
const app = express();

// Conexion a BD
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion exitosa a la base de datos')
} catch (error) {
    console.log(error)
}

// Habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

// Habilitar lectura de formularios
app.use(express.urlencoded({ extended: true }));

// Carpeta publica
app.use(express.static('public'));



// Routing
app.use('/auth', usuariosRoutes);



// Definir un puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});
