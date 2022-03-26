exports.up = function (knex, Promise) {
    return knex.schema.hasTable('cnae_fiscal').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('cnae_fiscal', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('nome')
                table.enum('status',['ativo','inativo']) 
                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('cnae_fiscal')
};

