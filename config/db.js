const config = require('../knexfile.js');
const db = require('knex')(config['development'])

module.exports = db;