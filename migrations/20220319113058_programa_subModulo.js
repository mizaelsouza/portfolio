exports.up = function (knex, Promise) {
    return knex.schema.hasTable('programa_SubModulo').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('programa_SubModulo', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('nome').notNullable()
                table.bigInteger('moduloId').unsigned().notNull()
                table.foreign('moduloId').references('modulos.id').onUpdate('CASCADE').onDelete('CASCADE')
                table.enum('status',['ativo','inativo'])  
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('programa_SubModulo')
};

