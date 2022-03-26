exports.up = function (knex, Promise) {
    return knex.schema.hasTable('produtos_valores').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('produtos_valores', table => {                
                table.decimal('estoque').notNullable()                
                table.decimal('custoContabil').notNullable()                
                table.decimal('CustoNota').notNullable()                
                table.decimal('CustoReposicao').notNullable()                
                table.decimal('preco').notNullable()                

                table.bigInteger('lojaId').unsigned().notNull()
                table.foreign('lojaId').references('loja.id')

                table.bigInteger('produtosId').unsigned().notNull()
                table.foreign('produtosId').references('produtos.id').onUpdate('CASCADE').onDelete('CASCADE')
                table.enum('status',['ativo','inativo']) 

                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('produtos_valores')
};

