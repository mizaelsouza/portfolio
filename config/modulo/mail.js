const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const {host, port, user, pass} = require('./mail/mailConfig.json') ;

const transport = nodemailer.createTransport({
    host, port, auth:{ user, pass}
});


transport.use('compile', hbs({
    viewEngine: { 
        extName: '.html',
        partialsDir: path.resolve(__dirname + '/resource/template'),
        defaultLayout: false
    },
    viewPath: path.resolve(__dirname + '/resource/template'),
    extname: '.html',
}));

module.exports = transport