exports.up = function (knex, Promise) {
    return knex.schema.hasTable('usuarios_programas_previlegios').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('usuarios_programas_previlegios', table => {
                                                                  
                table.bigInteger('usuarioId').unsigned().notNull()
                table.foreign('usuarioId').references('usuarios.id').onUpdate('CASCADE').onDelete('CASCADE')
                
                table.bigInteger('programaId').unsigned().notNull()
                table.foreign('programaId').references('programas.id').onUpdate('CASCADE').onDelete('CASCADE')

                table.bigInteger('previlegioId').unsigned().notNull()
                table.foreign('previlegioId').references('previlegios.id').onUpdate('CASCADE').onDelete('CASCADE')
                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('usuarios_programas_previlegios')
};

