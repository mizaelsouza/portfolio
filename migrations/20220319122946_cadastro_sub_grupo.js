exports.up = function (knex, Promise) {
    return knex.schema.hasTable('subGrupo').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('subGrupo', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('descricao').notNullable()

                table.bigInteger('grupoId').unsigned().notNull()
                table.foreign('grupoId').references('grupo.id')
                .onUpdate('CASCADE')
                .onDelete('CASCADE')
                table.enum('status',['ativo','inativo']) 

                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('subGrupo')
};

