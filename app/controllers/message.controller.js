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
    var fields = Utils.getBracketValues(template);
    var mandatoryFields = "hp";
    var newFields = mandatoryFields+","+fields;
    db('template_message')
        .insert(dataInsert)
        .returning('id')
        .then(async ([id]) => {
            var dataInsertFields = {
                owner_id: userId,
                template_id: id,
                field: newFields.toString()
            }
            await db('template_fields')
                .insert(dataInsertFields)
                .then(() => {
                    response = { success: true, message:'Template Added' }
                })
                .catch(error => {
                    response = { success: true, message:'Template Added but field not recognized '+error }
                })
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
    var fields = Utils.getBracketValues(req.query.template)
    var mandatoryFields = "hp";
    var newFields = mandatoryFields+","+fields;
    db('template_message')
        .where(dataSelect)
        .update(dataUpdate)
        .then(async (rows) => {
            var dataFieldCondition = {
                owner_id: userId,
                template_id: req.query.id_template,
            }
            var dataFieldUpdate = {
                field: newFields.toString()
            }
            await db('template_fields')
                .where(dataFieldCondition)
                .update(dataFieldUpdate)
                .then(() => {
                    response = { success: true, message:'Template Added' }
                })
                .catch(error => {
                    response = { success: true, message:'Template Added but field not recognized '+error }
                })
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

/**
 * @swagger
 * tags: 
 *   name: MessageFields
 *   description: WA MANAGEMENT
 * /field-message:
 *   get:
 *     summary: Template Fields Message
 *     tags: [MessageFields]
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
exports.getFields = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        template_id: req.query.id_template
    }
    db('template_fields')
        .where(dataSelect)
        .then(rows => {
            response = { success: true, message:'Field Fetched', data: rows }
        })
        .catch(error => {
            response = { success: false, message:'Failed to fetch fields', data: rows }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        })
}

/**
 * @swagger
 * tags: 
 *   name: MessageValues
 *   description: WA MANAGEMENT
 * /value-message:
 *   post:
 *     summary: Template Message Value
 *     tags: [MessageValues]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_template
 *            type: string
 *            in: query
 *            required: true
 *          - name: id_field_template
 *            type: string
 *            in: query
 *            required: true
 *          - name: field
 *            type: string
 *            in: query
 *            required: true
 *          - name: value
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
 *   get:
 *     summary: Template Message Value
 *     tags: [MessageValues]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_field_template
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
 *   put:
 *     summary: Template Message Value
 *     tags: [MessageValues]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_template
 *            type: string
 *            in: query
 *            required: true
 *          - name: id_field_template
 *            type: string
 *            in: query
 *            required: true
 *          - name: id_values
 *            type: string
 *            in: query
 *            required: true
 *          - name: field
 *            type: string
 *            in: query
 *            required: true
 *          - name: value
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
 *   delete:
 *     summary: Template Message Value
 *     tags: [MessageValues]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_values
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

exports.addValues = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataInsert = {
        owner_id: userId,
        template_id: req.query.id_template,
        template_field_id: req.query.id_field_template,
        field: req.query.field,
        value: req.query.value
    }
    var phoneNumber = req.query.value.split(',')[0].trim();
    if(Utils.validatePhoneNumber(phoneNumber)) {
        db('template_values')
            .insert(dataInsert)
            .then(() => {
                response = { success: true, message: 'Values Added'}
            })
            .catch(error => {
                response = { success: false, message: 'Failed To Add Values', data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response)
            })
    } else {
        response = { success: false, message: 'Invalid Phone Number'}
        Utils.sendStatus(res, 200, response)
    }

}
exports.getValues = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        template_field_id: req.query.id_field_template,
    }
    db('template_values')
        .where(dataSelect)
        .then(rows => {
            response = { success: true, message: 'Success get values', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Add Values', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        })

}
exports.updateValues = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        template_id: req.query.id_template,
        template_field_id: req.query.id_field_template,
        id: req.query.id_values
    }
    var dataUpdate = {
        field: req.query.field,
        value: req.query.value
    }
    var phoneNumber = req.query.value.split(',')[0].trim();
    if (Utils.validatePhoneNumber(phoneNumber)) {
        db('template_values')
            .where(dataSelect)
            .update(dataUpdate)
            .then(() => {
                response = { success: true, message: 'Values Updated'}
            })
            .catch(error => {
                response = { success: false, message: 'Failed To Update the Values', data: error }
            })
            .finally(() => {
                Utils.sendStatus(res, 200, response)
            })
    } else {
        response = { success: false, message: 'Invalid Phone Number'}
        Utils.sendStatus(res, 200, response)
    }

}
exports.deleteValues = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        id: req.query.id_values
    }
    db('template_values')
        .where(dataSelect)
        .del()
        .then(async (rows) => {
            response = { success: true, message:'Values Deleted', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Delete Values', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}


/**
 * @swagger
 * tags: 
 *   name: SendTemplates
 *   description: WA MANAGEMENT
 * /send-template:
 *   post:
 *     summary: Send Templates
 *     tags: [SendTemplates]
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
exports.sendTemplates = (req, res) => {
    var response = {};
    var userId = req.userId
    var object = {}
    var key = "data"
    object[key] = []
    var dataSelect = {
        'template_fields.owner_id': userId,
        'template_fields.template_id': req.query.id_template
    }
    db.select('template_fields.id', 'template_fields.template_id', 'template_fields.field', 'template_values.value', 'template_message.template')
        .from('template_fields')
        .where(dataSelect)
        .innerJoin('template_values', 'template_fields.id', 'template_values.template_field_id')
        .innerJoin('template_message', 'template_fields.template_id', 'template_message.id')
        .then(rows => {
            rows.forEach(function(value){
                var template = value.template;
                var field = value.field.split(',');
                var value = value.value.split(',');
                var child = {}
                for(var i=0;i<field.length;i++) {
                    child[field[i]] = value[i];
                }
                var json = JSON.parse(JSON.stringify(child));
                var hp = json.hp;
                template = Utils.replaceMe(template, json);
                Utils.sendWa(hp, template);
                object[key].push(child);
            });
            console.log(JSON.stringify(object));
            response = { success: true, message:'Template Sent', data: object }
        })
        .catch(error => {
            console.log(error);
            response = { success: false, message:'Failed to send the template', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}