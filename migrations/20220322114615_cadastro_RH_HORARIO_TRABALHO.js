exports.up = function (knex, Promise) {
    return knex.schema.hasTable("RH_HORARIO_TRABALHO").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("RH_HORARIO_TRABALHO", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("descricao").notNullable();
                table.time("horario1Inicio").notNullable();
                table.time("horario1Fim").notNullable();

                table.integer("horario1Intervalo").notNullable();

                table.time("horario2Inicio").notNullable();
                table.time("horario2Fim").notNullable();

                table.integer("horario2Intervalo").notNullable();

                /* table.bigInteger("rhDepartamentoId").unsigned().notNull();
                table
                    .foreign("rhDepartamentoId")
                    .references("rh_departamento.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
*/
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("RH_HORARIO_TRABALHO");
};
