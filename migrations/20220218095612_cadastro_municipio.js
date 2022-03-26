exports.up = function (knex, Promise) {
    return knex.schema.hasTable("municipio").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("municipio", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("nome").notNullable().unique();
                table.string("codigoIBGE");

                table.bigInteger("ufId").unsigned().notNull();
                table
                    .foreign("ufId")
                    .references("uf.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("municipio");
};
