exports.up = function (knex, Promise) {
    return knex.schema.hasTable("contatos").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("contatos", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("telefone");
                table.string("celular");
                table.string("email");
                table.string("site");

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
    return knex.schema.dropTable("contatos");
};
