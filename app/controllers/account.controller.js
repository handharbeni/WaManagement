'use strict'
var jwt = require('jsonwebtoken');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var bcrypt = require('bcryptjs');

/**
 * @swagger
 * tags:
 *   name: ACCOUNT
 *   description: ACCOUNT MANAGEMENT
 *  
 * /register:
 *   post:
 *     summary: Register an Account
 *     tags: [ACCOUNT]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: name
 *            in: query
 *            required: true
 *          - name: username
 *            in: query
 *            required: true
 *          - name: country_code
 *            in: query
 *            required: true
 *          - name: phone_number
 *            in: query
 *            required: true
 *          - name: password
 *            in: query
 *            required: true
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error
 *  
 * /login:
 *   post:
 *     summary: Login
 *     tags: [ACCOUNT]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: username
 *            in: query
 *            required: true
 *          - name: password
 *            in: query
 *            required: true
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./response-schema/response.json"
 *       500:
 *         description: Some server error
 *  
 * /me:
 *   get:
 *     summary: Get About Me
 *     tags: [ACCOUNT]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./response-schema/response.json"
 *       500:
 *         description: Some server error
 *   put:
 *     summary: Update About Me
 *     tags: [ACCOUNT]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: name
 *            in: query
 *            required: true
 *          - name: country_code
 *            in: query
 *            required: true
 *          - name: phone_number
 *            in: query
 *            required: true
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./response-schema/response.json"
 *       500:
 *         description: Some server error
 */
exports.register = (req, res) => {
    var response = {};
    var dataSelect = {
        username: req.query.username
    }
    var dataInsert = {
        name: req.query.name,
        username: req.query.username,
        country_code: req.query.country_code,
        phone_number: req.query.phone_number,
        password: bcrypt.hashSync(req.query.password, 8)
    }

    db('owners')
        .where(dataSelect)
        .then(async (rows) => {
            if(rows.length > 0){
                response = { success: false, message:'User Already Taken' }
            }else{
                await db('owners')
                        .insert(dataInsert)
                        .returning('id')
                        .then(resultInsert => {
                            response = { success: true, message:'Register Success, You Can Login', data: resultInsert }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Failed To Register', data: error }
                        });
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Register', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.login = (req, res) => {
    var response = {};
    var password = req.query.password
    var dataSelect = {
        username: req.query.username
    }
    db('owners')
        .where(dataSelect)
        .then(rows => {
            if(rows.length > 0){
                var passwordIsValid = bcrypt.compareSync(password, rows[0].password);
                if(!passwordIsValid){
                    response = { success: false, message:'Email / Password Invalid' }
                }else{
                    var tokenId = jwt.sign({ tokenId: rows[0].id }, process.env.node_secret, { expiresIn: process.env.node_expiresSession }) 
                    var tokens = jwt.sign({ toid: tokenId }, process.env.node_secret, { expiresIn: process.env.node_expiresSession });
                    var bodyResponse = [];
                    bodyResponse.push({
                        token: tokens,
                        name: rows[0].name,
                        username: rows[0].username,
                        country_code: rows[0].country_code,
                        phone_number: rows[0].phone_number
                    });
                    response = { success: true, message: 'Login Success', data: bodyResponse }
                }
            }else{
                response = { success: false, message:'User Not Found' }
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Get Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.getMe = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        id: userId
    }
    db('owners')
        .select(['created_at', 'name', 'username', 'country_code', 'phone_number'])
        .where(dataSelect)
        .then(rows => {
            if(rows.length > 0){
                response = { success: true, message: 'Success Get Data', data: rows }
            }else{
                response = { success: false, message: 'Failed Get Data' }
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Fetching Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

exports.updateMe = (req, res) => {
    var response = {}
    var userId = req.userId
    var dataCondition = {
        id: userId
    }
    var dataUpdate = {
        name: req.query.name,
        country_code: req.query.country_code,
        phone_number: req.query.phone_number
    }
    db('owners')
        .select(['created_at', 'name', 'username', 'country_code', 'phone_number'])
        .where(dataCondition)
        .update(dataUpdate)
        .returning('id')
        .then(rows => {
            response = { success: true, message: 'Success Update Data', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed Update Data', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}
