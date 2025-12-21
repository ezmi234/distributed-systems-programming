'use strict';

var utils = require('../utils/writer.js');
var Apiusersauthenticatorcurrent = require('../service/ApiusersauthenticatorcurrentService');

module.exports.logoutUser = function logoutUser (req, res, next) {
  Apiusersauthenticatorcurrent.logoutUser()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
