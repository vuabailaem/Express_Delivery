const NotificationsModel = require('../Models/NotificationsModel');

class NotificationService {
    constructor(){
        this.notificationsModel = NotificationsModel;
    }

    async insertRequestCompleted(requestId) {
        try {
            await this.notificationsModel.query().insert({requestId: requestId});
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async insertRequestFalse(requestId) {
        try {
            await this.notificationsModel.query().insert({requestId: requestId, status: 5});
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

module.exports = new NotificationService();
