
exports.up = function(knex) {
    return knex.schema.createTable('typeShips',(table) => {
        table.increments().notNull().primary();
        table.string('name').unique().index();
        table.integer('price', 100);
        table.integer('active', 10);
    })
};

exports.down = function(knex) {
  
};
