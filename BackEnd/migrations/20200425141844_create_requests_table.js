
exports.up = function(knex) {
    return knex.schema.createTable('requests', (table) => {
        table.increments();
        table.integer('customerId').notNull().unsigned();
        table.integer('typeShipId').notNull().unsigned();
        table.string('note', 100);
        table.string('start', 100);
        table.string('destination', 100);
        table.string('receiver', 100);
        table.string('phoneReceiver', 100);
        table.string('latStart', 100);
        table.string('lngStart', 100);
        table.float('length',100);
        table.integer('cost', 100);
        table.integer('acceptBy').unsigned();
        table.dateTime('startAt');
        table.dateTime('endAt');
        table.integer('status');
        table.float('starsCount', 10);
        table.string('comment', 100);
        table.timestamps(true, true);

        table.foreign('customerId').references('id').inTable('customers');
        table.foreign('acceptBy').references('id').inTable('shippers');
        table.foreign('typeShipId').references('id').inTable('typeShips');
    })
};

exports.down = function(knex) {

};
