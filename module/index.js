const controller = require('./user/auth/controller');
const auth = require('./user/auth/routes');
const excel = require('./user/excel/routes');
const utils = require('../lib/utils');
const journey = require('./user/journey/routes')

module.exports = function (app, http) {
    console.log('hello')
    app.use('/user', auth);
    app.use((req, res, next) => {
        utils.validateUser(req, res, next);
    });
    app.use('/journey', journey);
    // app.use('/report', excel); // For Excel ( not in use for now )
}