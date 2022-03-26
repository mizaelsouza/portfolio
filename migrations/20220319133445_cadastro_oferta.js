exports.up = function (knex, Promise) {
    return knex.schema.hasTable('oferta').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('oferta', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('descricao').notNullable()
                table.datetime('dataInicial').notNullable()
                table.datetime('dataFinal').notNullable()
                

                table.bigInteger('lojaId').unsigned().notNull()
                table.foreign('lojaId').references('loja.id').onUpdate('CASCADE').onDelete('CASCADE')           
                table.enum('status',['ativo','inativo']) 
                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('oferta')
};

