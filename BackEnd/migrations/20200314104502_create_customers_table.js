exports.up = function(knex) {
    return knex.schema.createTable('customers', (table) => {
        table.increments().notNull().primary();
        table.string('username').unique().index();
        table.string('password');
        table.integer('active', 10).defaultTo(1);
        table.string('firstname', 100);
        table.string('lastname', 100);
        table.string('socketId', 100);
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {

};