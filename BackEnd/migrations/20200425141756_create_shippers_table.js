
exports.up = function(knex) {
    return knex.schema.createTable('shippers',(table) => {
        table.increments().notNull().primary();
        table.string('username').unique().index();
        table.string('password');
        table.integer('active', 10).defaultTo(1);
        table.integer('role', 10).notNull().defaultTo(2);
        table.integer('starsCount', 10).defaultTo(5);
        table.string('firstname', 100);
        table.string('lastname', 100);
        table.string('phoneNumber', 45);
        table.string('socketId', 100);
        table.string('lat', 100);
        table.string('lng', 100);
        table.integer('status').defaultTo(0);
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
  
};
