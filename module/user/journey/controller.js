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

module.exports.getContacts = async function(req, res, next) {
    try {
        let user_id = req.headers.payload.id;
        let limit, skip;
        let { isActive, sortBy, orderBy, searchKeyword } = req.query;
        let page = parseInt(req.query.page) || 1;

        let populateQuery = { "path": "contact_list" };

        if (!(req.query.pagination && req.query.page)) {
            limit = parseInt(req.query.limit) || resPerPage;
            skip = parseInt(req.query.skip) || 0;
        } else {
            limit = resPerPage;
            skip = (page - 1) * resPerPage
        }
        populateQuery['match'] = {};
        isActive !== undefined ? populateQuery['match']['is_active'] = isActive : "";
        searchKeyword ? populateQuery['match']["name"] = { "$regex": new RegExp(searchKeyword) } : "";

        if (sortBy && (orderBy == 'desc' || orderBy == 'asc')) {
            populateQuery['options'] = {};
            populateQuery['options']['sort'] = {}
            populateQuery['options']['sort'][sortBy] = (orderBy === 'desc') ? -1 : 1;
        }
        let connectionResult = await User.find({ user_id: user_id }).populate(populateQuery).exec();
        if (connectionResult.length) {
            connectionResult = connectionResult[0];
            let result = {}
            result['totalRecords'] = connectionResult.contact_list.length;
            result.contact_list = connectionResult.contact_list.splice(skip, limit);
            result['totalResults'] = result.contact_list.length;
            if (req.query.pagination && req.query.page) {
                result["pagination"] = {
                    "totalRecords": result['totalRecords'],
                    "totalPages": Math.ceil(result['totalRecords'] / resPerPage),
                    "currentPage": page,
                    "resPerPage": resPerPage,
                    "hasPrevPage": page > 1,
                    "hasNextPage": page < Math.ceil(result['totalRecords'] / resPerPage),
                    "previousPage": page > 1 ? page - 1 : null,
                    "nextPage": page < Math.ceil(result['totalRecords'] / resPerPage) ? page + 1 : null
                }
            } else {
                result["pagination"] = false;
                if (req.query.limit) {
                    result["limit"] = limit
                }
                if (req.query.skip) {
                    result["skip"] = skip
                }
            }
            sendResponse(res, false, 200, 3009, [result]);
        } else {
            return sendResponse(res, false, 422, 5000);
        }
    }
    catch (error) {
        sendResponse(res, true, 500, 1000);
    }
}

module.exports.updateContacts = async function (req, res, next) {
    try {
        let connections = req.body;
        let user_id = req.headers.payload.id;
        let bulWriteQuery = queryForUpdateContacts(connections);
        await User.bulkWrite(bulWriteQuery);
        let userMobiles = [];
        connections.forEach(element => {
            userMobiles.push(element.mobile);
        });
        let connectionResult = await User.find({ "mobile": { "$in": userMobiles } }, { _id: 1 });
        let connectionIds = [];
        connectionResult.forEach(element => {
            connectionIds.push(element._id);
        });
        await User.updateOne({ user_id: user_id }, { $addToSet: { "contact_list": connectionIds } }, { "upsert": true })
        sendResponse(res, false, 200, 3010, connectionResult);
    } catch (err) {
        sendResponse(res, true, 500, 1000, err);
    }
}

function queryForUpdateContacts (connections) {
    let bulkWriteConnectionQuery = [];
    bulkWriteConnectionQuery = connections.map((el, index) => {
        el['is_active'] = false;
        return {
            updateOne: {
                "filter": { mobile: el.mobile },
                "update": { $setOnInsert: el },
                "upsert": true
            }
        }
    })
    return bulkWriteConnectionQuery;
}

module.exports.deleteContacts = async function (req, res) {
    try {
        let user_id = req.headers.payload.id;
        let connectionIds = req.query.connectionIds ? JSON.parse(req.query.connectionIds) : [];
        let data = await User.find({ user_id: user_id }, { "contact_list": 1 });
        if (data && data.length) {
            let validConnections = [];
            let invalidConnections = [];
            data.map(el => {
                connectionIds.forEach(elem => {
                    if (el.contact_list.includes(elem)) validConnections.push(elem);
                    else invalidConnections.push(elem)
                })
            })
            if (validConnections.length) {
                var query = {};
                query = {
                    $pull: {
                        "contact_list": {
                            $in: validConnections
                        }
                    }
                };
                let result = await User.updateOne({ user_id: user_id }, query, { multi: true });
                if (result.ok) {
                    let res = {
                        "deleted_result": validConnections
                    }
                    if (invalidConnections.length > 0) res["not_found"] = invalidConnections;
                    sendResponse(res, false, 200, 3011, res);
                } else sendResponse(res, true, 500, 1000);
            } else {
                let res = {
                    "not_found": invalidConnections
                }
                sendResponse(res, false, 422, 5000, res);
            }
        } else {
            let res = {
                "not_found": connectionIds
            }
            sendResponse(res, false, 422, 5000, res);
        }

    } catch (err) {
        console.log(err)
        sendResponse(res, true, 500, 1000, err);
    }
}