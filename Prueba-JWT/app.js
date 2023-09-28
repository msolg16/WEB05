const express = require('express');
const jwt = require("jsonwebtoken");
const config = require('./public/scripts/config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Middleware para mostrar un mensaje en la consola en cada ruta /user
app.all('/user',(req, res, next) => {
    console.log('Por aqui pasamos');
    next();
});


// Página principal que muestra el formulario de login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Página de registro
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

// Ruta para procesar datos de registro (formulario post)
app.post('/sinup', (req, res) => {
    console.log(`Post página de login ${req.body.username}`);
    console.log(`Post página de login ${req.body.password}`);
    
    // Verifica las credenciales y genera un token JWT
    if (`${req.body.username}` === 'msoles' 
        && `${req.body.password}` === 'tecsup') {
            console.log('Nombre: ' + `${req.body.username}` + ', Password: ' + `${req.body.password}`);
            const user = {
                nombre: `${req.body.username}`,
                password: `${req.body.password}`
            };
            jwt.sign({ user: user }, 'secretkey', { expiresIn: '86400s' }, (err, token) => {
                console.log({token: token});
                res.sendFile(__dirname + '/public/index.html');
            });
    } 
    else {
            return res.status(401).json({
                auth: false,
                message: 'No token provided'
            });
    }
});

// Ruta para procesar datos de inicio de sesión (formulario post)
app.post('/sinin', verifyToken, (req, res) => {
    // Verifica el token y envía un mensaje
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
            res.sendFile(__dirname + '/public/error.html');
        } else {
            res.json({
                mensaje: "Post fue Creado",
                authData: authData
            });
        }
    });
    res.sendFile(__dirname + '/public/index.html');

});

// Middleware para verificar y extraer el token del header
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(401);
        res.sendFile(__dirname + '/public/error.html');
    }
}

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Inicia el servidor en el puerto 3002
app.listen(3002, () => {
    console.log('Servidor corriendo en puerto 3002, http://localhost:3002/');
});
