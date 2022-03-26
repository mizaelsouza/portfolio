exports.up = function (knex, Promise) {
    return knex.schema.hasTable("pessoa_fisica").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("pessoa_fisica", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("cpf").notNullable();
                table.string("rg").notNullable();
                table.date("dtNascimento").notNullable();
                table.string("nomePai").notNullable();
                table.string("nomeMae").notNullable();

                table.bigInteger("sexoId").unsigned().notNull();
                table.foreign("sexoId").references("sexo.id");

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
    return knex.schema.dropTable("pessoa_fisica");
};
