exports.up = function (knex, Promise) {
    return knex.schema.hasTable("sexo").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("sexo", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("descricao").notNullable();
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("sexo");
};
