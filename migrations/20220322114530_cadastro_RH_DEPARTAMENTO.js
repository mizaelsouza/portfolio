exports.up = function (knex, Promise) {
    return knex.schema.hasTable("RH_DEPARTAMENTO").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("RH_DEPARTAMENTO", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("descricao").notNullable();
                table.specificType("status", "char").notNullable();
                /*
                table.bigInteger("uf").unsigned().notNull();
                table
                    .foreign("uf")
                    .references("uf.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");*/
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("RH_DEPARTAMENTO");
};
