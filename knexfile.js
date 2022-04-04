var ip = require("ip");

module.exports = {
    development: {
        client: "mysql",
        version: "8.0.26",
        connection: {
            database: "web",
            host: "aws-saci.c438zmpqmy0o.sa-east-1.rds.amazonaws.com",
            user: "admin",
            password: "M649235M",
        },
    },
    pool: { min: 0, max: 7 },

    migrations: {
        tableName: "migrations",
    },
};
