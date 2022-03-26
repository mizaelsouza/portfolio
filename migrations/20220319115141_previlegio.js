exports.up = function (knex, Promise) {
    return knex.schema.hasTable('previlegios').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('previlegios', table => {
                table.bigIncrements('id').primary().notNullable()                            
                table.string('nome').notNullable().unique()
                table.enum('status',['ativo','inativo'])  
                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('previlegios')
};

