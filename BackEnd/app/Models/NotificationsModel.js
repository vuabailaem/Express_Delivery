const Model = require('./Model');

class NotificationsModel extends Model{
    constructor(){
        super();
    }

    static get tableName(){
        return 'notifications';
    }
}

module.exports = NotificationsModel;
