const Router = require('express');
const controller = require('./controller');

const routes = new Router();

routes.post('/save-contact', controller.saveContact);
routes.get('/user-details', controller.userDetails);

module.exports = routes;

