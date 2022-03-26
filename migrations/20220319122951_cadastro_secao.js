exports.up = function (knex, Promise) {
    return knex.schema.hasTable('secao').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('secao', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('descricao').notNullable()
                table.enum('status',['ativo','inativo']) 

                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('secao')
};

