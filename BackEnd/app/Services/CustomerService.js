const CustomersModel = require('../Models/CustomersModel');
const RequestsModel = require('../Models/RequestsModel');
const NotificationsModel = require('../Models/NotificationsModel');

class CustomerService {
    constructor(){
        this.customersModel = CustomersModel;
        this.requestsModel = RequestsModel;
        this.notificationsModel = NotificationsModel;
    }
    
    async getData(id) {
        try {
            let result = await this.customersModel.query().where('id', id).first();
            if(result){
                return {
                    success: true,
                    data: result
                };
            }
            return {
                success: false,
                message: "cant not get info"
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getAll() {
        try {
            let result = await this.customersModel.query();
            if(!result) {
                return {
                    success: false,
                    data: undefined,
                }
            }
            return {
                success: true,
                data: result,
                time: new Date().getTime()
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async add(body) {
        try{
            let customer = await this.customersModel.query().where('username', body.username).first();
            if(customer) {
                return {
                    success: false,
                    message: 'DUPLICATE USERNAME'
                }
            }
            customer = await this.customersModel.query()
                .insert({username: body.username, password: body.password, firstname: body.firstname, lastname: body.lastname});
            if(!customer) {
                return {
                    success: false,
                    message: 'cannot insert'
                }
            }
            return {
                success: true,
                message: 'insert success',
                data: customer
            }
           } catch(e) {
            console.log(e);
            throw(e);
        }
    }

    async deleteById(id) {
        try{
            let result = await this.customersModel.query()
                .deleteById(id)
            if(!result) {
                return {
                    success: false,
                    data: null
                }
            }
            return {
                success: true,
                data: result
            }
        } catch (e) {
            console.log(e);
            throw(e);
        }
    }

    async updateById(id, body) {
        try{
            let result = await this.customersModel.query()
                .update({password: body.password, active: body.active, firstname: body.firstname, lastname: body.lastname})
                .where('id', id)
            if(!result) {
                return {
                    success: false,
                    data: null
                }
            }
            return {
                success: true,
                data: result
            };
        } catch (e) {
            console.log(e);
            throw(e);
        }
    }

    async activeCustomerById(id, body) {
        try {
            const result = await this.customersModel.query()
                .update({active: body.active})
                .where('id', id)
                .first();
            if(!result) {
                return {
                    success: false,
                    data: null
                }
            }
            return {
                success: true,
                data: result
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getMyNotification(userId) {
        try {
            const result = await this.notificationsModel.query()
                .select('notifications.*', 'requests.*')
                .join('requests', 'requests.id', 'notifications.requestId')
                .where('requests.customerId', userId)
                .where('notifications.checked',  0);
            if(!result) {
                return {
                    success: false,
                    message: "cant not get notifications"
                }
            }
            return {
                success: true,
                data: result
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async updateSocketIdOfCustomer(customerId, socketId) {
        try {
            let result = await this.customersModel.query().update({socketId: socketId})
                .where('id', customerId);
            if(!result) {
                return {
                    success: false,
                    message: "cant not update socketId"
                };
            }
            return {
                success: true,
                message: "update socketId success"
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getMyRequest(id) {
        try {
            let result = await this.requestsModel
                .query()
                .select('requests.*', 'shippers.firstname', 'shippers.lastname', 'shippers.phoneNumber', 'typeships.name as typeShipName')
                .join('shippers', 'requests.acceptBy', 'shippers.id')
                .join('typeships', 'typeships.id', 'requests.typeShipId')
                .where('requests.customerId', id)
                .where('requests.status', '>', 1)
                .orderBy('requests.id', 'desc');
            if(result){
                return {
                    success: true,
                    data: result
                };
            }
            return {
                success: false,
                message: "cant not get my requests"
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async checkedNotifications(userId) {
        try {
            const result = await this.notificationsModel.query()
                .join('requests', 'requests.id', 'notifications.requestId')
                .update({checked: 1})
                .where('requests.customerId', userId);
            if(!result) {
                return {
                    success: false,
                    message: 'cant not checked notifications'
                }
            }
            return {
                success: true,
                data: []
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

}

module.exports = new CustomerService();