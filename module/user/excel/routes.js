const Router = require('express');
const controller = require('./controller');

const routes = new Router();

routes.post('/create', controller.createExcel);

module.exports = routes;