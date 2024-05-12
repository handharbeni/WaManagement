require('dotenv').config();

var compression = require('compression'),
    helmet = require('helmet'),
    cors = require('cors'),
    express = require('express'),
    app = express(),
    port = process.env.node_port,
    bodyParser = require('body-parser'),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express"),
    whatsAppClient = require("@green-api/whatsapp-api-client");


const optionsJsDoc = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: 'WA API documentation',
            version: '1.0.0',
            description: 'API Documentation',
            license: {
                "name": "Apache 2.0",
                "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
            },
            contact: {
                name: "mhandharbeni",
                url: "-",
                email: "mhandharbeni@gmail.com",
            },
        },
        servers: [
            {
                url: process.env.node_server,
            },
        ],
        components: {
            securitySchemes: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'access-token',
                    description: "Key for accessing the feature",
                }
            }
        },
        security: [{
            JWT: []
        }]        
    },
    apis: ["./app/**/*.js"],
};

app.use(cors())
app.use(compression())
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({limit: '100mb'}))

const webHookAPI = whatsAppClient.webhookAPI(app, '/ga-webhooks')
webHookAPI.onIncomingMessageText((data, idInstance, idMessage, sender, typeMessage, textMessage) => {
    console.log(`Incoming Notification data ${JSON.stringify(data)}`)
});

var route = require('./app/routes/route');

route(app);

const specs = swaggerJsdoc(optionsJsDoc);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(process.env.node_port, () => console.log('Express server listening on port ' + process.env.node_port));