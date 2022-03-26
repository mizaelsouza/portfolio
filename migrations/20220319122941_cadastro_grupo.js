exports.up = function (knex, Promise) {
    return knex.schema.hasTable('grupo').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('grupo', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('descricao').notNullable()
                table.enum('status',['ativo','inativo']) 
                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('grupo')
};

