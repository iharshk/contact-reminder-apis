const Router = require('express');
const controller = require('./controller');
var express = require('express');
const app = express();

const routes = new Router();

routes.get('/getotp', controller.sendOtp);
routes.post('/signup', controller.signup);
routes.post('/login', controller.login);

app.all('*', (req,res) => {
    res.status(404).send({
        'error': true,
        'status': 404,
        'message': 'API Not Found'
    });
});

module.exports = routes;