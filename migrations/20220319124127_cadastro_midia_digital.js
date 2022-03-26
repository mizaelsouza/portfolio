exports.up = function (knex, Promise) {
    return knex.schema.hasTable('midia_digital').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('midia_digital', table => {                
                table.bigIncrements('id').primary().notNullable()
                table.string('descricao')
                table.string('fundo_url')      
                table.enum('status',['ativo','inativo'])               
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('midia_digital')
};

