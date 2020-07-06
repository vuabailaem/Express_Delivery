const RequestsModel = require('../Models/RequestsModel');
const ShippersModel = require('../Models/ShippersModel');

class RequestService {
    constructor(){
        this.requestsModel = RequestsModel;
        this.shippersModel = ShippersModel;
    }

    async createRequest(request) {
        try {
            let result = await this.requestsModel.query().insert(request);
            if(result){
                return result;
            }
            return {
                success: false,
                message: "cant not insert to DB"
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getAll() {
        try {
            const result = await this.requestsModel.query()
                .select('requests.*', 'typeships.name as typeShipName', 'shippers.username as shipperName', 'customers.username as customerName')
                .join('typeships', 'requests.typeShipId', 'typeships.id')
                .join('shippers', 'requests.acceptBy', 'shippers.id')
                .join('customers', 'requests.customerId', 'customers.id');
            if(!result) {
                return {
                    success: false,
                    data: undefined
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

    async deleteById(id) {
        try{
            let result = await this.requestsModel.query()
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

    async getById(id) {
        try {
            const result = await this.requestsModel.query()
                .select('requests.*', 'typeships.name as typeShipName', 'customers.username as customerName')
                .join('typeships', 'requests.typeShipId', 'typeships.id')
                .join('customers', 'requests.customerId', 'customers.id')
                .where('requests.id', id).first();
            if(!result) {
                console.log('cant not get request by Id');
                return undefined;
            }
            return {
                result
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async updateSocketIdAndPosition(id, shipper) {
        try {
            let result = await this.shipperModel.query()
                .update({socketId: shipper.socketId, lat: shipper.lat, lng: shipper.lng, status: 1})
                .where('id', id);
            if(result) {
                return {
                    message: true,
                    data: result
                }
            }
            return {
                message: false,
                data: null
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async requestComplete(requestId) {
        try {
            const date = new Date();
            let result = await this.requestsModel.query().update({status: 3, endAt: date}).where({id: requestId});
            if(!result) {
                return {
                    success: true,
                    message: 'cant not set complete request'
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

    async requestCancel(requestId) {
        try {
            let result = await this.requestsModel.query().update({status: 5}).where({id: requestId});
            if(!result) {
                return {
                    success: true,
                    message: 'cant not set complete request'
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

    async getRequestCustomer(id) {
        try {
            let result = await this.requestsModel.query()
                .select('requests.id', 'customers.socketId', 'customers.id')
                .join('customers', 'requests.customerId', 'customers.id')
                .where('requests.id', id);
            if (!result) {
                return {
                    success: false,
                    message: 'cant not get customer request data '+id
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

    async getRequestShipper(id) {
        try {
            let result = await this.requestsModel.query()
                .select('requests.id', 'shippers.socketId', 'shippers.id')
                .join('shippers', 'requests.acceptBy', 'shippers.id')
                .where('requests.id', id);
            if (!result) {
                return {
                    success: false,
                    message: 'cant not get shipper request data '+id
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

    async shipperAccept(shipperId, requestId) {
        try {
            const date = new Date();
            let result = await this.requestsModel.query().update({acceptBy: shipperId, startAt: date, status: 2}).where({id: requestId});
            if(!result) {
                console.log('set acceptBy false');
                return {
                    success: false,
                    message: 'cant not update Request table'
                };
            }
            result = await this.shippersModel.query().update({status: 2}).where({id: shipperId});
            if(!result) {
                console.log('shipper status 2 false');
                return {
                    success: false,
                    message: 'cant not set shipper status to 2'
                };
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

    async confirmRequest(requestId, starsCount, comment) {
        try {
            let result = await this.requestsModel.query()
                        .update({status: 4, starsCount, comment})
                        .where({id: requestId});
            let shipper = await this.shippersModel.query()
                        .select('shippers.*', 'requests.acceptBy')
                        .join('requests', 'requests.acceptBy', 'shippers.id')
                        .where('requests.id', requestId).first();
            if(shipper) {
                let stars = ((shipper.starsCount*4 + starsCount)/5).toExponential(1);
                await this.shippersModel.query().update({starsCount: stars})
                        .where('shippers.id', shipper.id);
            }
            if(!result) {
                return {
                    success: false,
                    message: 'cant not confirm request' + requestId
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

}

module.exports = new RequestService();