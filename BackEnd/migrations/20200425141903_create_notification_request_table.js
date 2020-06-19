
exports.up = function(knex) {
    return knex.schema.createTable('notifications', (table) => {
        table.increments().notNullable().primary();
        table.integer('requestId').notNullable().unsigned();
        table.integer('status', 10).notNullable().defaultTo(3);
        table.integer('checked').notNullable().defaultTo(0);
        table.timestamps(true, true);

        table.foreign('requestId').references('id').inTable('requests');
    })
};

exports.down = function(knex) {

};
