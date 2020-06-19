
exports.up = function(knex) {
    return knex.schema.createTable('admin',(table) => {
        table.increments().notNull().primary();
        table.string('username').unique().index();
        table.string('password');
        table.integer('role', 10).notNull().defaultTo(0);
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {

};
