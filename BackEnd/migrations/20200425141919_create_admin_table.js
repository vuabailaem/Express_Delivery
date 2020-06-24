exports.up = function(knex) {
    return knex.schema.createTable('admin', (table) => {
        table.increments().notNull().primary();
        table.string('username').unique().index();
        table.string('password');
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {

};