const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Obtener el token del encabezado

    if (!token) return res.sendStatus(401); // No autorizado si no hay token

    jwt.verify(token, 'access', (err, user) => {
        if (err) return res.sendStatus(403); // Prohibido si hay un error al verificar el token
        req.user = user; // Agregar usuario a la solicitud
        next(); // Pasar al siguiente middleware
    });
});


 
const PORT = 3031;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
