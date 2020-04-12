const Model = require('./Model');

class CustomersModel extends Model{
    constructor(){
        super();
    }

    static get tableName(){
        return 'customers';
    }
}

module.exports = CustomersModel;
