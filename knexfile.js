var ip = require("ip");

module.exports = {
    development: {
        client: "mysql",
        version: "8.0.26",
        connection: {
            database: "web",          
            host: env.process.HOST_AWS,
            user: env.process.USER_AWS,
            password: env.process.PASS,
        },
    },
    pool: { min: 0, max: 7 },

    migrations: {
        tableName: "migrations",
    },
};
