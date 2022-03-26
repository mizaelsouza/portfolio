exports.up = function (knex, Promise) {
    return knex.schema.hasTable("pessoa_juridica").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("pessoa_juridica", (table) => {
                table.bigIncrements("id").primary().notNullable();                
                table.string("cnpj").notNullable();
                table.string("nomeFantasia").notNullable();
                table.string("ie").notNullable();
                table.date("dtConstituicao").notNullable();

                table.bigInteger("crtId").unsigned().notNull();
                table
                    .foreign("crtId")
                    .references("regime_tributario.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

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
    return knex.schema.dropTable("pessoa_juridica");
};
