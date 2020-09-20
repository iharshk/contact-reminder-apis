const { sendResponse } = require('../../../lib/utils');

module.exports.saveContact = function(req, res, next){
    try{
        console.log('journey starts now')
        sendResponse(res, false, 200, 3007)
    } catch(err){

    }

}