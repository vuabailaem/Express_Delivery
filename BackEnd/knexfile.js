module.exports = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        database: 'express_delivery_dtb',
        user: 'root',
        password: 'root'
    },
    pool: {
        min: 2,
        max: 10
    },
    migration: {
        tableName: 'migrations'
    }
}