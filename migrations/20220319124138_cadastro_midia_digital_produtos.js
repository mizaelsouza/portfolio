exports.up = function (knex, Promise) {
    return knex.schema.hasTable('midia_digital_produtos').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('midia_digital_produtos', table => {                                
                
                table.bigInteger('midiaId').unsigned().notNull()
                table.foreign('midiaId').references('midia_digital.id').onUpdate('CASCADE').onDelete('CASCADE')           

                table.bigInteger('produtosId').unsigned().notNull()
                table.foreign('produtosId').references('produtos.id').onUpdate('CASCADE').onDelete('CASCADE')           
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('midia_digital_produtos')
};

