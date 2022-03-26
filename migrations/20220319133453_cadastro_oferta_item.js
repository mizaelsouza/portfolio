exports.up = function (knex, Promise) {
    return knex.schema.hasTable('oferta_item').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('oferta_item', table => {
                               
                table.decimal('precoOferta')
                table.bigInteger('ofertaId').unsigned().notNull()
                table.foreign('ofertaId').references('loja.id').onUpdate('CASCADE').onDelete('CASCADE')           

                table.bigInteger('produtosId').unsigned().notNull()
                table.foreign('produtosId').references('produtos.id').onUpdate('CASCADE').onDelete('CASCADE')           
               
                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('oferta_item')
};

