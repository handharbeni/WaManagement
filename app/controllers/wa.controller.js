'use strict'
const { VariableInstance } = require('twilio/lib/rest/serverless/v1/service/environment/variable');
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
const axios = require('axios');
const whatsAppClient = require("@green-api/whatsapp-api-client");
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
 * /wa-bulk:
 *   post:
 *     summary: Send WA Bulk
 *     tags: [WA]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_kontak
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
 * /wa-import:
 *   post:
 *     summary: Import data from WA
 *     tags: [WA]
 *     produces:
 *          - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error 
 * /wa-login:
 *   get:
 *     summary: Login WA Account
 *     tags: [WA]
 *     produces:
 *          - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error
 * /wa-template:
 *   post:
 *     summary: Send WA Template
 *     tags: [WA]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_template
 *            in: query
 *            required: true
 *          - name: json
 *            in: query
 *            required: true
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error
 * /wa-raw-template:
 *   post:
 *     summary: Send WA Template
 *     tags: [WA]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: template
 *            in: query
 *            required: true
 *          - name: json
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

exports.webhooks = (req, res) => {
    // var express = require('express')
    // var app = express();
    // app.use(express.json());
    // const webHookAPI = whatsAppClient.webhookAPI(app, '/ga-webhooks')
    // webHookAPI.onIncomingMessageText((data, idInstance, idMessage, sender, typeMessage, textMessage) => {
    //     console.log(`Incoming Notification data ${JSON.stringify(data)}`)
    // });
}

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
                const restAPI = whatsAppClient.restAPI(({
                    idInstance: process.env.node_greenapi_idinstance,
                    apiTokenInstance: process.env.node_greenapi_tokeninstance
                }));
                
                var phoneDestination = rows[0].country_code+""+rows[0].phone_number;
                while(phoneDestination.charAt(0) === '+'){
                    phoneDestination = phoneDestination.substring(1);
                }
                const data = {
                    chatId: phoneDestination+'@c.us',
                    message: req.query.message
                };

                restAPI.message.sendMessage(data.chatId, phoneDestination, data.message)
                    .then(dataResponse => {
                        response = { success: true, message:'Message has been sent', data: dataResponse.data}
                        Utils.sendStatus(res, 200, response)
                    })
                    .catch(error => {
                        response = { success: false, message:'Something wen\'t wrong', data: error}
                        Utils.sendStatus(res, 200, response)
                    })
            } else {
                response = { success: false, message:'Contact Not Found'}
                Utils.sendStatus(res, 200, response)
            }
        })
        .catch(error => {
            console.log(error);
            response = { success: false, message: 'Failed To Send Message', data: error }
            Utils.sendStatus(res, 200, response)
        })
}

exports.sendGroup = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        'groups_contacts.owner_id': userId,
        'groups_contacts.group_id': req.query.id_group
    }

    db('groups_contacts')
        .join('groups', 'groups.id', 'groups_contacts.group_id')
        .join('contacts', 'contacts.id', 'groups_contacts.contact_id')
        .select(['groups.id as groupId', 'groups.name as groupName', 'contacts.id as contactId', 'contacts.name as contactName', 'contacts.country_code', 'contacts.phone_number', 'contacts.created_at'])
        .where(dataSelect)
        .then(async (rows) => {
            response = { success: true, message:'List Group Found', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Fetch Group', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });    
}

exports.sendBulk = (req, res) => {
    var response = {};
    var userId = req.userId
    var arrayId = req.query.id_kontak.split(",");
    var dataSelect = {
        owner_id: userId,
        id: arrayId[0]
    }
    arrayId.forEach((item) => {
        sendPmWa(item, userId, req.query.message);
    })
    response = { success: true, message: 'Message has been sent' }
    Utils.sendStatus(res, 200, response);
}

exports.importData = (req, res) => {
    var cReg = new RegExp("@c\.us", "g")
    var gReg = new RegExp("@g\.us", "g")

    var response = {}
    var userId = req.userId
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.green-api.com/waInstance7103921358/getContacts/83cf71910a324004afb5db03cca8e5e207e9989c95414702ad',
        headers: { 
            'Content-Type': 'application/json'
        }
    };

    axios.request(config)
        .then((response) => {
            response.data.forEach((item) => {
                var arrayId = item.id.split("@")
                var isGroup = arrayId[1]==='g.us'?true:false;
                console.log(item.id+" "+isGroup);
                if(isGroup) {
                    // insert to the groups

                } else {
                    // insert to the contacts

                }
            })
            // response = { success: true, message:'List Contact Found', data: response.data }
            Utils.sendStatus(res, 200, response);
        })
        .catch((error) => {
            // response = { success: true, message:'Something wen\'t wrong', data: error }
            Utils.sendStatus(res, 200, response);
        });
}

exports.loginWa = (req, res) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://qr.green-api.com/waInstance7103921358/83cf71910a324004afb5db03cca8e5e207e9989c95414702ad',
        headers: { 
            'Content-Type': 'application/json'
        }
    };

    axios.request(config)
        .then((response) => {
            console.log(response);
            Utils.sendStatus(res, 200, response);
        })
        .catch((error) => {
            // response = { success: true, message:'Something wen\'t wrong', data: error }
            Utils.sendStatus(res, 200, response);
        });
}

function getBase64(url) {
    return axios
        .get(url, {
            responseType: 'arraybuffer'
        })
        .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

exports.sendPmWaByNumber = (phoneNumber, textMessage) => {
    const restAPI = whatsAppClient.restAPI(({
        idInstance: process.env.node_greenapi_idinstance,
        apiTokenInstance: process.env.node_greenapi_tokeninstance
    }));
    
    var phoneDestination = phoneNumber;
    while(phoneDestination.charAt(0) === '+'){
        phoneDestination = phoneDestination.substring(1);
    }
    const data = {
        chatId: phoneDestination+'@c.us',
        message: textMessage
    };

    restAPI.message.sendMessage(data.chatId, phoneDestination, data.message)
        .then(dataResponse => {
            console.log(`sendMessageResponse ${dataResponse}`);
        })
        .catch(error => {
            console.log(`errorSendMessage ${error}`);
        })
}

function sendPmWa(idContact, idUser, message) {
    return new Promise((resolve, reject) => {
        try {
            var dataSelect = {
                owner_id: idUser,
                id: idContact
            }
        
            db('contacts')
            .select(['created_at', 'name', 'country_code', 'phone_number'])
            .where(dataSelect)
            .then(async (rows) => {
                if (rows.length>0) {
                    const restAPI = whatsAppClient.restAPI(({
                        idInstance: process.env.node_greenapi_idinstance,
                        apiTokenInstance: process.env.node_greenapi_tokeninstance
                    }));
                    
                    var phoneDestination = rows[0].country_code+""+rows[0].phone_number;
                    while(phoneDestination.charAt(0) === '+'){
                        phoneDestination = phoneDestination.substring(1);
                    }
                    restAPI.message.sendMessage(phoneDestination+'@c.us', phoneDestination, message)
                        .then(dataResponse => {
                            resolve(dataResponse.data);
                        })
                        .catch(error => {
                            reject(error)
                        })
                } else {
                    reject("Contact Not Found")
                }
            })
            .catch(error => {
                reject(error)
            })        
        } catch(err) {
            reject(err)
        }
    });
}

exports.sendWaTemplate = (req, res) => {
    var response = {success: true, message:'Message has been sent'};
    var userId = req.userId
    var dataSelectTemplate = {
        owner_id: userId,
        id: req.query.id_template
    }
    var json = JSON.parse(req.query.json);
    console.log(json)
    db('template_message')
        .where(dataSelectTemplate)
        .then(rows => {
            
            for(var attributename in json){
                // console.log(json[attributename][0]);
                for( var i = 0; i < json[attributename].length; i++ ) {
                    var message = rows[0].template;
                    var hp = json[attributename][i]['hp'];
                    message = Utils.replaceMe(message, json[attributename][i]);
                    Utils.sendWa(hp, message);
                }
            }
            // console.log(rows[0].template);
        })
        .catch(error => {
            response = {success: false, message: error}
            Utils.sendStatus(res, 200, response);
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

exports.sendWaRawTemplate = (req, res) => {
    var response = {success: true, message:'Message has been sent'};
    var template = req.query.template;
    var json = JSON.parse(req.query.json);
    // console.log(Utils.getBracketValues(template));
    for (var attributename in json){
        for( var i = 0; i < json[attributename].length; i++ ) {
            var message = template;
            var hp = json[attributename][i]['hp'];
            message = Utils.replaceMe(message, json[attributename][i]);
            Utils.sendWa(hp, message);
        }
    }

    Utils.sendStatus(res, 200, response);
}