exports.up = function (knex, Promise) {
    return knex.schema.hasTable("rh_evento").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("rh_evento", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("descricao").notNullable();
                table.specificType("creditoDebito", "char").notNullable();
                table.specificType("valorPercentual", "char").notNullable();
                table.specificType("baseDecimo", "int").notNullable();

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
    return knex.schema.dropTable("rh_evento");
};
