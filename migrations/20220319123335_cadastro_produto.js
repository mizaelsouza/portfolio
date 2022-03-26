exports.up = function (knex, Promise) {
    return knex.schema.hasTable('produtos').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('produtos', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('descricao').notNullable()
                

                table.bigInteger('secaoId').unsigned().notNull()
                table.foreign('secaoId').references('secao.id').onUpdate('CASCADE').onDelete('CASCADE')

                table.bigInteger('grupoId').unsigned().notNull()
                table.foreign('grupoId').references('grupo.id').onUpdate('CASCADE').onDelete('CASCADE')

                table.bigInteger('subGrupoId').unsigned().notNull()
                table.foreign('subGrupoId').references('subGrupo.id').onUpdate('CASCADE').onDelete('CASCADE')
                table.enum('status',['ativo','inativo']) 

                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('produtos')
};

