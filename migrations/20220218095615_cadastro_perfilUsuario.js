
exports.up = function (knex, Promise) {
    return knex.schema.hasTable('perfil_usuarios').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('perfil_usuarios', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('nome').notNullable().unique()                 
                table.enum('status',['ativo','inativo'])  
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('perfil_usuarios')
};

