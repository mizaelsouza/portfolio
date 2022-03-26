exports.up = function (knex, Promise) {
    return knex.schema.hasTable('produtos_fotos').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('produtos_fotos', table => {                
                table.bigIncrements('id').primary().notNullable()
                table.string('url')
                table.string('nome')
                table.string('size')
                table.integer('fileName')               

                table.bigInteger('produtosId').unsigned().notNull()
                table.foreign('produtosId').references('produtos.id').onUpdate('CASCADE').onDelete('CASCADE')
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('produtos_fotos')
};

