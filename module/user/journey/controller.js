const { sendResponse } = require('../../../lib/utils');
const User = require('../auth/model')
const Contacts = require('./contacts-model');

module.exports.saveContact = async function (req, res, next) {
    try {
        let user_id = req.headers.id;
        if(!Array.isArray(req.body)) sendResponse(res, false, 400, 6002)

        let bulkWriteQuery = req.body.map(elem => {
            elem['is_active'] = false;
            return {
                updateOne: {
                    "filter": { mobile: elem.mobile },
                    "update": { $setOnInsert: elem },
                    "upsert": true
                }
            }
        });

        await User.bulkWrite(bulkWriteQuery);
        let mobile_nos = [];
        req.body.map(el => mobile_nos.push(el.mobile));
        let contactsResult = await User.find({ "mobile": { "$in": mobile_nos } }, { _id: 1 });
        let contactIds = [];
        contactsResult.forEach(element => contactIds.push(element._id));
        await Contacts.updateOne({user_id : user_id}, {$set : {user_id : user_id, contact_list : contactIds}}, {upsert : true});

        sendResponse(res, false, 200, 3007, contactsResult)
    } catch (err) {
        console.log(err)
        sendResponse(res, false, 403, 6001, err)
    }

}

module.exports.userDetails = async function (req, res, next) {
    try {
        let user_id = req.headers.id;
        let userDetails = await User.find({_id : user_id});
        sendResponse(res, false, 200, 3008, userDetails);
    } catch (err) {
        sendResponse(res, false, 403, 6001, err);
    }
}