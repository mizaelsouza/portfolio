var ip = require("ip");

module.exports = {
    
    development: {
        client: "mysql",
        version: "8.0.26",
        connection: {
            database: "web",          
            host: 'localhost',
            user: 'root',
            password: 'root',
        },
    },
    pool: { min: 0, max: 7 },

    migrations: {
        tableName: "migrations",
    },
};
