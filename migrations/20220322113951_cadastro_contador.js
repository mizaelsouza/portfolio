exports.up = function (knex, Promise) {
    return knex.schema.hasTable("contador").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("contador", (table) => {
                table.bigIncrements("id").primary().notNullable();
                table.string("crcInscricao").notNullable();

                table.bigInteger("ufId").unsigned().notNull();
                table.foreign("ufId").references("uf.id");

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
    return knex.schema.dropTable("contador");
};
