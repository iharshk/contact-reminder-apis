const Router = require('express');
const controller = require('./controller');

const routes = new Router();

routes.post('/save-contact', controller.saveContact);

module.exports = routes;

