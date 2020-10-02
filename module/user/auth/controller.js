const User = require('./model');
const { sendResponse } = require('../../../lib/utils');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

module.exports.signup = async function (req, res, next) {
    try {
        let password = req.body.password || null;
        req.body.is_active = true;
        req.body.password = password ? bcrypt.hashSync(password) : null;

        let userDeatails = await User.findOne({ mobile: req.body.mobile });
        if (!userDeatails) {
            let signedup = await User.insertMany(req.body);
            if (signedup.length) {
                let sessionId = await createSession({ mobile: req.body.mobile });
                let result = { sessionId: sessionId }
                sendResponse(res, false, 200, 3001, result);
            } else {
                sendResponse(res, true, 200, 6001);
            }

        } else if (userDeatails && userDeatails.mobile == req.body.mobile && userDeatails.is_active === false) {

            let query = { $set: { "is_active": true, password: req.body.password } }
            let updateData = await User.findOneAndUpdate({ mobile: req.body.mobile }, query);
            if (updateData) {
                let sessionId = await createSession({ mobile: req.body.mobile });
                let result = { sessionId: sessionId }
                sendResponse(res, false, 200, 3001, result);
            } else {
                sendResponse(res, true, 200, 6001);
            }

        } else {
            sendResponse(res, false, 200, 3002);
        }
    } catch (err) {
        console.log(err._message);
        sendResponse(res, true, 400, 6000, err.message);
    }
};

module.exports.sendOtp = async function (req, res, next) {
    try {
        let mobile_no = req.query.mobile;
        if (mobile_no && mobile_no.length >= 10) {
            let otp = Math.floor(100000 + Math.random() * 900000)
            sendResponse(res, false, 200, 3000, { 'OTP': otp })
        } else {
            sendResponse(res, true, 403, 3006)
        }
    } catch (err) {
        sendResponse(res, true, 400, 6000, err.message);
    }
}

module.exports.login = async function (req, res, next) {
    try {
        let password = req.body.password || null;
        let userDeatails = await User.findOne({ mobile: req.body.mobile });
        if (userDeatails) {
            let hashPass = await bcrypt.compare(password, userDeatails.password);
            console.log('===', hashPass)
            if (hashPass) {
                let sessionId = await createSession({ mobile: req.body.mobile });
                let result = { sessionId: sessionId }
                sendResponse(res, false, 200, 3003, result);
            } else {
                sendResponse(res, false, 200, 3004);
            }
        } else {
            sendResponse(res, false, 200, 3005);
        }
    } catch (err) {
        console.log(err);
        sendResponse(res, true, 400, 6000, err.message);
    }
}

/**
 * @body {mobile_no : '0987654321'}
*/
function createSession(body){
   return  jwt.sign(body, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE });
}