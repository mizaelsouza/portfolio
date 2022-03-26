exports.up = function (knex, Promise) {
    return knex.schema.hasTable("transportadora").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("transportadora", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.date("dtCadastro").notNullable();
                table.string("observacao").notNullable();

                table.bigInteger("pessoasId").unsigned().notNull();
                table
                    .foreign("pessoasId")
                    .references("pessoas.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("transportadora");
};
