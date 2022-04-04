exports.up = function (knex, Promise) {
    return knex.schema.hasTable("rh_funcao").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("rh_funcao", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("descricao").notNullable();

                table.bigInteger("rhDepartamentoId").unsigned().notNull();
                table
                    .foreign("rhDepartamentoId")
                    .references("rh_departamento.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

                table.specificType("status", "char").notNullable();
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("rh_funcao");
};
