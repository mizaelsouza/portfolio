exports.up = function (knex, Promise) {
    return knex.schema.hasTable('regime_tributario').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('regime_tributario', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('nome')
                table.enum('status',['ativo','inativo']) 
                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('regime_tributario')
};

