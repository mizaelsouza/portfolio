exports.up = function (knex, Promise) {
    return knex.schema.hasTable("colaborador").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("colaborador", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.date("dtAdmissao").notNullable();
                table.date("dtDemissao").notNullable();

                table.decimal("salarioBase").notNullable();
                table.string("pisPasep").notNullable();

                table.string("carteiraNumero").notNullable();
                table.string("carteiraSerie").notNullable();
                table.string("carteiraOrgoEmissor").notNullable();
                table.string("observacao").notNullable();

                table.bigInteger("rhDepartamentoId").unsigned().notNull();
                table
                    .foreign("rhDepartamentoId")
                    .references("rh_departamento.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

                table.bigInteger("rhFuncaoId").unsigned().notNull();
                table
                    .foreign("rhFuncaoId")
                    .references("rh_funcao.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");

                table.bigInteger("rhHorarioTrabalhoId").unsigned().notNull();
                table
                    .foreign("rhHorarioTrabalhoId")
                    .references("rh_horario_trabalho.id")
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
    return knex.schema.dropTable("colaborador");
};
