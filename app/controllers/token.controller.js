'use strict';
var jwt = require('jsonwebtoken');
var config = require('../../tools/config');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');

function verifyToken(req, res, next) {
    var token = req.headers['access-token'];
    if (!token) return Utils.sendStatus(res, 200, { success: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return Utils.sendStatus(res, 200, { success: false, message: 'Failed to authenticate token.' });
      jwt.verify(decoded.toid, config.secret, function(err, nDecoded) {
        db.from('owners').select('*')
          .where('id', nDecoded.tokenId)
          .then((value)=>{
            if (value.length < 1) return Utils.sendStatus(res, 200, { success: false, message: 'No user found.' });
          })
          .catch((error)=>{
            return Utils.sendStatus(res, 200, { success: false, message: 'There was a problem finding the user.', data:error });
          })
          .finally(()=>{
            req.userId = nDecoded.tokenId;
            next();
          });
      })
    });
  }
module.exports = verifyToken;
