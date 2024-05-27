'use strict'
var db = require('../../knex/knex');
var Utils = require('../utils/utils');
/**
 * @swagger
 * tags: 
 *   name: Message
 *   description: WA MANAGEMENT* 
 * 
 * /template-message:
 *   post:
 *     summary: Template Message
 *     tags: [Message]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: template
 *            type: string
 *            in: query
 *            required: true
 *            format: textarea
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error
 *   get:
 *     summary: Template Message
 *     tags: [Message]
 *     produces:
 *          - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error
 *   put:
 *     summary: Template Message
 *     tags: [Message]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_template
 *            type: string
 *            in: query
 *            required: true
 *          - name: template
 *            type: string
 *            in: query
 *            required: true
 *            format: textarea
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Template Message
 *     tags: [Message]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_template
 *            type: string
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

exports.templateMesssage = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId
    }
    var template = req.query.template;
    var dataInsert = {
        owner_id: userId,
        template: template
    }

    db('template_message')
        .insert(dataInsert)
        .then(() => {
            response = { success: true, message:'Template Added' }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Add Tempalte', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        })
}

exports.getTemplateMessage = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId
    }
    db('template_message')
        .where(dataSelect)
        .then(async (rows) => {
            response = { success: true, message:'Template Found', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Fetch Template', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.updateTemplateMessage = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        id: req.query.id_template
    }
    var dataUpdate = {
        template: req.query.template
    }
    db('template_message')
        .where(dataSelect)
        .update(dataUpdate)
        .then(async (rows) => {
            response = { success: true, message:'Template Updated', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Update Template', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.deleteTemplateMessage = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        id: req.query.id_template
    }

    db('template_message')
        .where(dataSelect)
        .del()
        .then(async (rows) => {
            response = { success: true, message:'Template Deleted', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Delete Template', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}