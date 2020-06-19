const Model = require('./Model');

class AdminModel extends Model{
    constructor(){
        super();
    }

    static get tableName(){
        return 'admin';
    }
}

module.exports = AdminModel;
