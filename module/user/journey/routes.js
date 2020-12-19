const Router = require('express');
const controller = require('./controller');

const routes = new Router();

routes.post('/save-contact', controller.saveContact);
routes.get('/user-details', controller.userDetails);
routes.get('/get-contacts', controller.getContacts);
routes.post('/add-contacts', controller.updateContacts);
routes.delete('/delete-contacts', controller.deleteContacts);

module.exports = routes;

