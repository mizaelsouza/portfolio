exports.up = function (knex, Promise) {
    return knex.schema.hasTable("cliente").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("cliente", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.date("dtCadastro").notNullable();
                table.decimal("limiteCredito").notNullable();
                table.string("observacao").notNullable();
                table.enum("status", ["ativo", "inativo"]);

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
    return knex.schema.dropTable("cliente");
};
