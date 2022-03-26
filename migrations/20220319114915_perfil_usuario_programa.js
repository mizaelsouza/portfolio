exports.up = function (knex, Promise) {
    return knex.schema.hasTable('perfil_usuarios_programas').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('perfil_usuarios_programas', table => {
                table.bigIncrements('id').primary().notNullable()
                                              
                table.bigInteger('perfilId').unsigned().notNull()
                table.foreign('perfilId').references('perfil_usuarios.id').onUpdate('CASCADE').onDelete('CASCADE')
                
                table.bigInteger('programaId').unsigned().notNull()
                table.foreign('programaId').references('programas.id').onUpdate('CASCADE').onDelete('CASCADE')
                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('perfil_usuarios_programas')
};

