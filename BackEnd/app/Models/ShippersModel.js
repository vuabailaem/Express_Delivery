const Model = require('./Model');

class ShippersModel extends Model{
    constructor(){
        super();
    }

    static get tableName(){
        return 'shippers';
    }
}

module.exports = ShippersModel;
