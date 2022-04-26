exports.up = function (knex, Promise) {
    return knex.schema.hasTable("loja").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("loja", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("nomeFantasia").notNullable().unique();
                table.string("cnpj").unique;
                table.string("im");
                table.string("iest");
                table.string("site");
                table.bigInteger("crtId").unsigned().notNull();
                table
                    .foreign("crtId")
                    .references("regime_tributario.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
                table.bigInteger("cnaeId").unsigned().notNull();
                table
                    .foreign("cnaeId")
                    .references("cnae_fiscal.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

                table.bigInteger("pessoasId").unsigned().notNull();

                table
                    .foreign("pessoasId")
                    .references("pessoas.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
                table.enum("status", ["ativo", "inativo"]);
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("loja");
};
