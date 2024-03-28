'use strict'
var db = require('../../knex/knex');
var Utils = require('../utils/utils');

/**
 * @swagger
 * tags:
 *   name: CONTACT
 *   description: CONTACT MANAGEMENT
 *  
 * /contact:
 *   post:
 *     summary: Add Contact
 *     tags: [CONTACT]
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
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error
 *   get:
 *     summary: Get Contact Info
 *     tags: [CONTACT]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_contact
 *            in: query
 *            required: true
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error
 *   put:
 *     summary: Update Contact Info
 *     tags: [CONTACT]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_contact
 *            in: query
 *            required: true
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
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Delete Contact
 *     tags: [CONTACT]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_contact
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
 * /listContact:
 *   get:
 *     summary: Get List Contact
 *     tags: [CONTACT]
 *     produces:
 *          - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error */

exports.addContact = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        country_code: req.query.country_code,
        phone_number: req.query.phone_number
    }
    var dataInsert = {
        name: req.query.name,
        country_code: req.query.country_code,
        phone_number: req.query.phone_number,
        owner_id: userId
    }

    db('contacts')
        .where(dataSelect)
        .then(async (rows) => {
            if(rows.length > 0){
                response = { success: false, message:'Contact Available' }
            }else{
                await db('contacts')
                        .insert(dataInsert)
                        .returning('id')
                        .then(resultInsert => {
                            response = { success: true, message:'Contact Added', data: resultInsert }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Failed To Add Contact', data: error }
                        });
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Add Contact', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.getContact = (req, res) => {
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
            response = { success: true, message:'Contact Found', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Add Contact', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.updateContact = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        id: req.query.id_contact
    }
    var dataUpdate = {
        name: req.query.name,
        country_code: req.query.country_code,
        phone_number: req.query.phone_number        
    }

    db('contacts')
        .where(dataSelect)
        .then(async (rows) => {
            if(rows.length > 0){
                await db('contact')
                        .where(dataSelect)
                        .update(dataUpdate)
                        .returning('id')
                        .then(resultInsert => {
                            response = { success: true, message:'Contact Updated', data: resultInsert }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Failed To Update Contact', data: error }
                        });
            }else{
                response = { success: false, message:'Contact Doesn\'t Exist' }
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Update Contact', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.deleteContact = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        id: req.query.id_contact
    }

    db('contacts')
        .where(dataSelect)
        .del()
        .then(async (rows) => {
            response = { success: true, message:'Contact Deleted' }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Delete Contact', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.listContact = (req, res) => {
    var response = {};
    var userId = req.userId;
    var dataSelect = {
        owner_id: userId
    }

    db('contacts')
        .select(['id', 'created_at', 'name', 'country_code', 'phone_number'])
        .where(dataSelect)
        .then((rows) => {
            response = { success: true, message:'Success to Fetch', data: rows }
        })
        .catch((error) => {
            response = { success: true, message:'Failed to Fetch', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}