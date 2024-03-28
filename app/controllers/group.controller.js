'use strict'
var db = require('../../knex/knex');
var Utils = require('../utils/utils');

/**
 * @swagger
 * tags:
 *   name: GROUP
 *   description: GROUP MANAGEMENT
 *  
 * /group:
 *   post:
 *     summary: Add Group
 *     tags: [GROUP]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: name
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
 *     summary: Get Group Info
 *     tags: [GROUP]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_group
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
 *     summary: Update Group Info
 *     tags: [GROUP]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_group
 *            in: query
 *            required: true
 *          - name: name
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
 *     summary: Delete Group
 *     tags: [GROUP]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_group
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
 *  
 * /listGroup:
 *   get:
 *     summary: Get list Group
 *     tags: [GROUP]
 *     produces:
 *          - application/json
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error 
 * 
 * /listGroupContact:
 *   get:
 *     summary: Get List Contact from Group
 *     tags: [GROUP]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_group
 *            in: query
 *            required: true
 *     responses:
 *       200:
 *         description: Ok
 *         shema: 
 *              $ref: "./app/response-schema/response.json"
 *       500:
 *         description: Some server error 
 *   post:
 *     summary: Add Contact to Group
 *     tags: [GROUP]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_group
 *            in: query
 *            required: true
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
  *   delete:
 *     summary: Remove Contact from Group
 *     tags: [GROUP]
 *     produces:
 *          - application/json
 *     parameters:
 *          - name: id_group
 *            in: query
 *            required: true
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
 */

exports.addGroup = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        name: req.query.name
    }
    var dataInsert = {
        name: req.query.name,
        owner_id: userId
    }

    db('groups')
        .where(dataSelect)
        .then(async (rows) => {
            if(rows.length > 0){
                response = { success: false, message:'Group Available' }
            }else{
                await db('groups')
                        .insert(dataInsert)
                        .returning('id')
                        .then(resultInsert => {
                            response = { success: true, message:'Group Added', data: resultInsert }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Failed To Add Group', data: error }
                        });
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Add Group', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.getGroup = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        id: req.query.id_group
    }

    db('groups')
        .select(['created_at', 'name'])
        .where(dataSelect)
        .then(async (rows) => {
            response = { success: true, message:'Group Found', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Fetch Group', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.updateGroup = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        id: req.query.id_group
    }
    var dataUpdate = {
        name: req.query.name
    }

    db('groups')
        .where(dataSelect)
        .then(async (rows) => {
            if(rows.length > 0){
                await db('groups')
                        .where(dataSelect)
                        .update(dataUpdate)
                        .returning('id')
                        .then(resultInsert => {
                            response = { success: true, message:'Group Updated', data: resultInsert }
                        })
                        .catch(error => {
                            response = { success: false, message: 'Failed To Update Group', data: error }
                        });
            }else{
                response = { success: false, message:'Group Doesn\'t Exist' }
            }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Update Group', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.deleteGroup = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId,
        id: req.query.id_group
    }

    db('groups')
        .where(dataSelect)
        .del()
        .then(async (rows) => {
            response = { success: true, message:'Group Deleted' }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Delete Group', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.getListGroup = (req, res) => {
    var response = {};
    var userId = req.userId
    var dataSelect = {
        owner_id: userId
    }

    db('groups')
        .select(['id', 'created_at', 'name'])
        .where(dataSelect)
        .then(async (rows) => {
            response = { success: true, message:'List Group Found', data: rows }
        })
        .catch(error => {
            response = { success: false, message: 'Failed To Fetch Group', data: error }
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response)
        });
}

exports.getListGroupContact = (req, res) => {
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

exports.addContactstoGroup = (req, res) => {
    var response = {};
    var userId = req.userId;
    var dataSelectInsert = {
        owner_id: userId,
        group_id: req.query.id_group,
        contact_id: req.query.id_contact
    }
    db('groups_contacts')
        .where(dataSelectInsert)
        .then(async (rows) => {
            if (rows.length > 0) {
                response = { success: false, message:'Contact Available in the Group'};
            } else {
                await db('groups_contacts')
                    .insert(dataSelectInsert)
                    .returning('id')
                    .then(resultInsert => {
                        response = { success: true, message:'Contact Added to the Group', data: resultInsert }
                    })
                    .catch(error => {
                        response = { success: false, message: 'Failed To Add Contact to the Group', data: error }
                    });
            }
        })
        .catch(error => {
            response = { success: false, message:'Failed to add Contact to the Group', data: error};
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });
}

exports.deleteContactFromGroup = (req, res) => {
    var response = {};
    var userId = req.userId;
    var dataSelectDelete = {
        owner_id: userId,
        group_id: req.query.id_group,
        contact_id: req.query.id_contact
    }
    db('groups_contacts')
        .where(dataSelectDelete)
        .then(async (rows) => {
            if (rows.length > 0) {
                await db('groups_contacts')
                    .where(dataSelectDelete)
                    .del()
                    .then(resultInsert => {
                        response = { success: true, message:'Contact Deleted from Group', data: resultInsert }
                    })
                    .catch(error => {
                        response = { success: false, message: 'Failed To Delete Contact from Group', data: error }
                    });
            } else {
                response = { success: false, message:'Contact Doesn\'t Exist in the Group'};
            }
        })
        .catch(error => {
            response = { success: false, message:'Failed to Delete Contact from Group', data: error};
        })
        .finally(() => {
            Utils.sendStatus(res, 200, response);
        });    
}