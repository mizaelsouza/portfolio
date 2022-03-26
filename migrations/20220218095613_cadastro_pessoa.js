exports.up = function (knex, Promise) {
    return knex.schema.hasTable("pessoas").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("pessoas", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("nome").notNullable().unique();
                table.string("cep");
                table.string("logradouro");
                table.string("numero");
                table.string("complemento");
                table.string("bairro");
                table.string("telefone");

                table.bigInteger("municipioId").unsigned().notNull();
                table
                    .foreign("municipioId")
                    .references("municipio.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

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
    return knex.schema.dropTable("pessoas");
};
