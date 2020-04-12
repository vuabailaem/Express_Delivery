const { Model } = require('objection');

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        database: 'express_delivery_dtb',
        user: 'root',
        password: 'root',
    },
    pool: {
        min: 2,
        max: 10,
    }
});

Model.knex(knex);

module.exports = Model;