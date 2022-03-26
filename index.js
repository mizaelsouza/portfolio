require("dotenv").config();
const express = require("express"); /*importa as configuraçoes do express*/
const db = require("./config/db"); /*importa as configuraçoes do banco*/
const consign = require("consign"); /*importa as configuraçoes do consign*/
const app = express();

consign()
    .include("./config/passport.js")
    .then("./config/middlewares.js")
    .then("./api")
    .then("./config/router.js")
    .into(app);

app.db = db;

/*
app.get('/',(req, res, next)=>{
    res.send('Servidor Inicializado')
})
*/

const porta = "3003";
console.log("Servidor rodando na PORTA: ", porta);
app.listen(process.env.PORT || porta);
