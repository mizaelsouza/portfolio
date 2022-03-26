exports.up = function (knex, Promise) {
    return knex.schema.hasTable('modulos').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('modulos', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('nome').notNullable().unique()                                 
                table.enum('status',['ativo','inativo'])  
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('modulos')
};

