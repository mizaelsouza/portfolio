exports.up = function (knex, Promise) {
    return knex.schema.hasTable("RH_FUNCAO").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("RH_FUNCAO", (table) => {
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
    return knex.schema.dropTable("RH_FUNCAO");
};
