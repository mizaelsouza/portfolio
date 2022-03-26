exports.up = function (knex, Promise) {
    return knex.schema.hasTable('programas_previlegios').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('programas_previlegios', table => {
                table.bigIncrements('id').primary().notNullable()

                                                       
                table.bigInteger('programaId').unsigned().notNull()
                table.foreign('programaId').references('programas.id')

                table.bigInteger('previlegioId').unsigned().notNull()
                table.foreign('previlegioId').references('previlegios.id')

                table.enum('status',['ativo','inativo']) 
                
            })
        }
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('programas_previlegios')
};

