const Model = require('./Model');

class RequestsModel extends Model{
    constructor(){
        super();
    }

    static get tableName(){
        return 'requests';
    }
}

module.exports = RequestsModel;
