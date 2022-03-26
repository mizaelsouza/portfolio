exports.up = function (knex, Promise) {
    return knex.schema.hasTable('programas').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('programas', table => {
                table.bigIncrements('id').primary().notNullable()
                table.string('nome').notNullable()
                table.string('path').notNullable().unique()                                 
                table.bigInteger('programaSubModuloId').unsigned().notNull()
                table.foreign('programaSubModuloId').references('programa_SubModulo.id').onUpdate('CASCADE').onDelete('CASCADE')
                table.enum('status',['ativo','inativo'])  
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('programas')
};

