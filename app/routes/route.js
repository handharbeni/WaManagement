'use strict';

module.exports = function(app) {
    var general = require('../controllers/general.controller');
    var account = require('../controllers/account.controller');
    var contact = require('../controllers/contact.controller');
    var group = require('../controllers/group.controller');
    var wa = require('../controllers/wa.controller');
    var verifyToken = require('../controllers/token.controller');

    app.route('/').post(general.index).get(general.index).put(general.index).delete(general.index);
    app.route('/register').post(account.register).get(general.index).put(general.index).delete(general.index);
    app.route('/login').post(account.login).get(general.index).put(general.index).delete(general.index);
    app.route('/me').post(general.index).get(verifyToken, account.getMe).put(verifyToken, account.updateMe).delete(general.index);
    app.route('/contact').post(verifyToken, contact.addContact).get(verifyToken, contact.getContact).put(verifyToken, contact.updateContact).delete(verifyToken, contact.deleteContact);
    app.route('/listContact').post(general.index).get(verifyToken, contact.listContact).put(general.index).delete(general.index);
    app.route('/group').post(verifyToken, group.addGroup).get(verifyToken, group.getGroup).put(verifyToken, group.updateGroup).delete(verifyToken, group.deleteGroup);
    app.route('/listGroup').post(general.index).get(verifyToken, group.getListGroup).put(general.index).delete(general.index);
    app.route('/listGroupContact').post(verifyToken, group.addContactstoGroup).get(verifyToken, group.getListGroupContact).put(general.index).delete(verifyToken, group.deleteContactFromGroup);
    app.route('/wa-pm').post(verifyToken, wa.sendPm).get(general.index).put(general.index).delete(general.index);
    app.route('/wa-bulk').post(verifyToken, wa.sendBulk).get(general.index).put(general.index).delete(general.index);
    app.route('/wa-import').post(verifyToken, wa.importData).get(general.index).put(general.index).delete(general.index);
}
