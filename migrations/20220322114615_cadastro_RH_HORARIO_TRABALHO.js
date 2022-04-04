exports.up = function (knex, Promise) {
    return knex.schema.hasTable("rh_horario_trabalho").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("rh_horario_trabalho", (table) => {
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
    return knex.schema.dropTable("rh_horario_trabalho");
};
