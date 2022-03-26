exports.up = function (knex, Promise) {
    return knex.schema.hasTable("uf").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("uf", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("nome").notNullable().unique();
                table.string("sigla");
                table.string("codigoIBGE");

                table.bigInteger("paisId").unsigned().notNull();
                table
                    .foreign("paisId")
                    .references("pais.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("uf");
};
