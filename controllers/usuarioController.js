import { check, validationResult } from 'express-validator';
import { generarID } from '../helpers/tokens.js';
import Usuario from '../model/Usuarios.js';
import { emailRegistro } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion'

    });
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    });
}

const registrar = async (req, res) => {
    // Validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe ser de al menos 6 caracteres').run(req);
    await check("repetir_password").equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req);


    let resultado = validationResult(req);
    //return res.json(resultado.array())

    // Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Extraer datos del request ya validado
    const { nombre, email, password } = req.body;

    // Verificar usuarios duplicados.
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: [{ msg: "El usuario ya esta registrado" }],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Almacenar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarID()
    })

    // Enviar email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // Mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada exitosamente',
        mensaje: 'Hemos enviado un mail de confirmacion, presiona en el enlace.'
    })
}



const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raices'
    })
}





export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}