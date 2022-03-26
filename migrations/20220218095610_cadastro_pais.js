exports.up = function (knex, Promise) {
    return knex.schema.hasTable("pais").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("pais", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("nome").notNullable().unique();
                table.string("codigoSISCOMEX");
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("pais");
};
