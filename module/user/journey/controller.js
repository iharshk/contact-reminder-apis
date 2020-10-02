const { sendResponse } = require('../../../lib/utils');
const User = require('../auth/model')
const Contacts = require('./contacts-model');

module.exports.saveContact = async function (req, res, next) {
    try {
        let user_id = req.headers.id;
        if (Array.isArray(req.body)) {
            let a = []
            req.body.forEach(element => {


            });

        }

        sendResponse(res, false, 200, 3007)
    } catch (err) {
        console.log(err)

    }

}

module.exports.userDetails = function (req, res, next) {
    try {
        let { mobile_no } = req.body;
        console.log('Get user Details', mobile_no);


        sendResponse(res, false, 200, 3007)
    } catch (err) {

    }

}