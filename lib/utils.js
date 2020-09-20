const responseFile = require("./response");
const jwt = require("jsonwebtoken");

exports.sendResponse = function (response, error, statusCode, responseCode, data) {
  let output = {
    error: error,
    msg: responseFile[responseCode]["msg"],
    code: responseFile[responseCode]["code"],
  };
  if (data) {
    output.data = data;
  }
  response.status(statusCode).send(output);
};

exports.validateUser = function (req, res, next) {
  jwt.verify(req.headers['access-token'], process.env.SECRET_KEY, function (err, decoded) {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      // add user id to request
      console.log(decoded)
      req.body.mobile_no = decoded.mobile;
      next();
    }
  });
}