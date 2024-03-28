'use strict'
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
var config = require('../../tools/config');
const request = require('request');
const axios = require('axios');

// const client = require('twilio')(config.sid, config.token);
// const whatsAppClient = require("@green-api/whatsapp-api-client");
// const restAPI = whatsAppClient.restAPI({
//     idInstance: config.greenapi_idinstance,
//     apiTokenInstance: config.greenapi_tokeninstance,
// });
const idInstance = config.greenapi_idinstance;
const apiTokenInstance = config.greenapi_tokeninstance;

/**
 * @swagger
 * tags:
 *   name: WA
 *   description: WA MANAGEMENT
 *  
 * /wa-pm:
 *   post:
 *     summary: Send WA PM
 *     tags: [WA]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_contact
 *            in: query
 *            required: true
 *          - name: message
 *            in: query
 *            required: true
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error
 * /wa-group:
 *   post:
 *     summary: Send WA Group
 *     tags: [WA]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_group
 *            in: query
 *            required: true
 *          - name: message
 *            in: query
 *            required: true
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error 
 */

exports.sendPm = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        id: req.query.id_contact
    }

    db('contacts')
        .select(['created_at', 'name', 'country_code', 'phone_number'])
        .where(dataSelect)
        .then(async (rows) => {
            if (rows.length>0) {
                const urlSendMessage = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
                var phoneDestination = rows[0].country_code+""+rows[0].phone_number;
                while(phoneDestination.charAt(0) === '+'){
                    phoneDestination = phoneDestination.substring(1);
                }
                const data = {
                    chatId: phoneDestination+'@c.us',
                    message: req.query.message
                };
                await axios.post(urlSendMessage, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    console.log(response.data);
                    response = { success: true, message:'Message has been sent', data: response.data}
                    Utils.sendStatus(res, 200, response)
                })
                .catch((error) => {
                    console.log(error);
                    response = { success: false, message:'Something wen\'t wrong', data: error}
                    Utils.sendStatus(res, 200, response)
                });
            } else {
                response = { success: false, message:'Contact Not Found'}
                Utils.sendStatus(res, 200, response)
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Send Message', data: error }
            Utils.sendStatus(res, 200, response)
        })
}