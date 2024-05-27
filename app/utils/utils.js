var db = require('../../knex/knex');
require('dotenv').config()

const axios = require('axios');
const whatsAppClient = require("@green-api/whatsapp-api-client");


exports.sendStatus = function(res, status, body){
    res.status(status).send(body);
}

exports.getDateMillis = function(result){
    var d = new Date();
    var milliseconds = Date.parse(d);
    result(milliseconds);
}

exports.sendEmail = async function(email, subject, tmphtml){
    return await db.from('tools').select('*')
            .then((value)=>{
                var configs = [];
                value.forEach((value)=>{
                    if(value.name.startsWith('mail_')){
                        configs[value.name] = value.value;
                    }
                });

                let transporter = nodemailer.createTransport({
                    pool: true,
                    host: `${configs['mail_host']}`,
                    port: `${configs['mail_port']}`,
                    secure: `${configs['mail_secure']}`,
                    auth: {
                        user: `${configs['mail_user']}`,
                        pass: `${configs['mail_pass']}`
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                transporter.verify(function(error, success) {
                    if (!error){
                        nodemailer.createTestAccount((err, account) => {
                            // var tmphtml = pug.renderFile(path.join(__dirname,'../../views/index.pug'),{name:getname,code:getcode});
                            // var tmphtml = `<!DOCTYPE html><html lang="en"><head><title>mail</title></head><style>.words{font-family:'SF UI Display'}</style></html><body><div style="width:auto;"><div><img id="background" src="http://66.96.237.20:6499/view/11" width="100%"></div><div style="margin-top:5%;" align="center"><p style="color:black;font-size:30pt;font-family:&quot;SF UI Display Semibold&quot;;">Hi ${getname},</p><p style="color:#aeb3bd;font-size:14pt;font-family:&quot;SF UI Display Medium&quot;;">We've received a requested to reset your password.</p><p class="words" style="color:#aeb3bd;">Here is the security code you requested.</p><p style="font-size:25pt;color:#2c6bd1;font-family:&quot;SF UI Display Medium&quot;;font-style:bold;">${getcode}</p><p class="words" style="color:#aeb3bd;">If you didn't make the request, just ignore this email.</p><p class="words" style="color:#aeb3bd;">Thank you.</p><div style="border-bottom: 1px solid #D5D5D2;"></div><p class="words" style="color:#aeb3bd;">If you have any questions or concerns, get in touch by Emails</p></div></div></body>`;
                            let mailOptions = {
                                from: `${configs['mail_user']}`,
                                to: email,
                                subject: subject,
                                html: tmphtml
                            };                    
                            transporter.sendMail(mailOptions);
                        });        
                    }
                });
            });
}


exports.getConfigs = function(prefix) {
    return new Promise(function(resolve, reject) {
        db.from('tools').select("*")
            .then((value) => {        
                var configs = [];
                value.forEach((value)=>{
                    if(value.name.startsWith(prefix)){
                        configs[value.name] = value.value;
                    }
                });
                resolve(configs);
        });
    })
}

exports.replaceMe = function (template, data) {
    // JSON.parse {"name": "Beni", "status":"morning"}
    // hi {name}, good {status}
    const pattern = /{\s*(\w+?)\s*}/g; // {property}
    return template.replace(pattern, (_, token) => data[token] || '');
}

exports.sendWa = async function(phoneNumber, message) {
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
        message: message
    };

    await restAPI.message.sendMessage(phoneDestination, phoneDestination, data.message)
        .then(dataResponse => {
            return "OK"
        })
        .catch(error => {
            return "FAILED"
        })
}

// var json = JSON.parse('{"data":[{"hp":"+6281556617741","name":"Beni","status":"Morning","level":"Developer"}]}')
// var template = "hi {name}, good {status}, welcome as a {level}";
// for(var attributename in json){
//     for( var i = 0,length = json[attributename].length; i < length; i++ ) {
//         var hp = json[attributename][i]['hp'];
//         var message = Utils.replaceMe(template, json[attributename][i]);
//         var sendWa = Utils.sendWa(hp, message);
//         console.log(sendWa);
//     }
// }
