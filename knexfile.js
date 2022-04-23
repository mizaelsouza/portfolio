var ip = require("ip");

module.exports = {
    
    development: {
        client: "mysql",
        version: "8.0.26",
        connection: {
            database: "web",          
            host: process.env.HOST_AWS,
            user: process.env.USER_AWS,
            password: process.env.PASS,
        },
    },
    pool: { min: 0, max: 7 },

    migrations: {
        tableName: "migrations",
    },
};
