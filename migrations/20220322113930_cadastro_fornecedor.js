exports.up = function (knex, Promise) {
    return knex.schema.hasTable("fornecedor").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("fornecedor", (table) => {
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
    return knex.schema.dropTable("fornecedor");
};
