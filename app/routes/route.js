'use strict';

module.exports = function(app) {
    const whatsAppClient = require("@green-api/whatsapp-api-client");

    var general = require('../controllers/general.controller');
    var account = require('../controllers/account.controller');
    var contact = require('../controllers/contact.controller');
    var group = require('../controllers/group.controller');
    var wa = require('../controllers/wa.controller');
    var message = require('../controllers/message.controller');
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
    app.route('/wa-login').post(general.index).get(wa.loginWa).put(general.index).delete(general.index);
    app.route('/template-message').post(verifyToken, message.templateMesssage).get(verifyToken, message.getTemplateMessage).put(verifyToken, message.updateTemplateMessage).delete(verifyToken, message.deleteTemplateMessage);
    app.route('/wa-template').post(verifyToken, wa.sendWaTemplate);
    // app.route('/ga-webhooks').post(wa.webhooks).get(wa.webhooks).put(general.index).delete(general.index);


    function ciEquals(a, b) {
        return typeof a === 'string' && typeof b === 'string'
            ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
            : a === b;
    }
    
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }
    
    const webHookAPI = whatsAppClient.webhookAPI(app, '/ga-webhooks')
    webHookAPI.onIncomingMessageText((data, idInstance, idMessage, sender, typeMessage, textMessage) => {
        console.log(`incomingMessage ${data}`)
        var splittedMessage = textMessage.split(" ");
        var botResponse = "";
        if (ciEquals(splittedMessage[0], "ppdb")) {
            var s2 = splittedMessage[1];
            botResponse = "Informasi PPDB untuk nomor pendaftaran "+s2+" adalah sebagai berikut";
        } else if (ciEquals(splittedMessage[0], "spp")) {
            var nis = splittedMessage[1];
            // var month = splittedMessage[2];
            // var year = splittedMessage[3];
            botResponse = "Informasi SPP untuk NIS "+nis+" adalah sebesar Rp xxx.xxx dan dapat dibayarkan melalui rek an sekolah"
        } else {
            botResponse = "Format tidak dikenal"
        }

        var phoneNumber = replaceAll(data.senderData.chatId, "@c.us", "");
        wa.sendPmWaByNumber(phoneNumber, botResponse);
    });
}
