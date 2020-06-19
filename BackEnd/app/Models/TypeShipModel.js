
const Model = require('./Model');

class TypeShipModel extends Model{
    constructor(){
        super();
    }

    static get tableName(){
        return 'typeships';
    }
}

module.exports = TypeShipModel;
