exports.up = function (knex, Promise) {
    return knex.schema.hasTable('usuario_programas').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('usuario_programas', table => {
                table.bigIncrements('id').primary().notNullable()
                                              
                table.bigInteger('usuarioId').unsigned().notNull()
                table.foreign('usuarioId').references('usuarios.id').onUpdate('CASCADE').onDelete('CASCADE')
                
                table.bigInteger('programaId').unsigned().notNull()
                table.foreign('programaId').references('programas.id').onUpdate('CASCADE').onDelete('CASCADE')
                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('usuario_programas')
};

