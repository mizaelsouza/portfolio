exports.up = function (knex, Promise) {
    return knex.schema.hasTable("usuarios").then(function (exists) {
        if (!exists) {
            return knex.schema.createTable("usuarios", (table) => {
                table.bigIncrements("id").primary().notNull();
                table.string("login").unique().notNull();
                table.specificType("senha", "longblob");
                table.string("email").unique().notNull();
                table.string("pwdresettoken");
                table.date("dtExpiracaoToken");
                table.bigInteger("perfilId").unsigned().notNull();
                table
                    .foreign("perfilId")
                    .references("perfil_usuarios.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
                table.enum("status", ["ativo", "inativo"]).notNull();
            });
        }
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable("usuarios");
};
