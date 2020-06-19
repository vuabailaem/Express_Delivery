const ShippersModel = require('../Models/ShippersModel');

class ShipperService {
    constructor(){
        this.shipperModel = ShippersModel;
        
    }

    async getData(id) {
        try {
            let result = await this.shipperModel.query().where('id', id).first();
            if(result){
                return {
                    success: true,
                    data: result
                };
            }
            return {
                success: false,
                message: "cant not get Shipper info"
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async add(body) {
        try {
            let shipper = await this.shipperModel.query()
                .insert({username: body.username, password: body.password, firstname: body.firstname, lastname: body.lastname, phoneNumber: body.phoneNumber});
            if(!shipper) {
                return {
                    success: false,
                    message: 'CANT NOT INSERT'
                }
            }
            return {
                success: true,
                message: 'INSERT SUCCESS',
                data: shipper
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getAllReady() {
        try {
            const shippers = await this.shipperModel.query().where({status: 1});

            if(!shippers) {
                return {
                    message: false,
                    data: null
                }
            }

            if(shippers.length === 0) {
                return [];
            }

            return shippers;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async updateById(id, body) {
        try {
            const result = await this.shipperModel.query()
                .update(
                    {
                        username: body.username,
                        password: body.price,
                        firstname: body.firstname,
                        lastname: body.lastname,
                        phoneNumber: body.phoneNumber})
                .where('id', id)
                .first();
            if(!result) {
                return {
                    success: false,
                    message: 'CAN NOT UPDATE',
                    data: null
                }
            }
            return {
                success: true,
                message: 'UPDATE SUCCESS',
                data: result
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getAll() {
        try {
            let result = await this.shipperModel.query();
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

    async activeShipperById(id, body) {
        try {
            const result = await this.shipperModel.query()
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

    async deleteById(id) {
        try{
            let result = await this.shipperModel.query()
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

    async readyShip(id) {
        try {
            let result = await this.shipperModel.query()
                .update({status: 1})
                .where('id', id)
                .first();
            if(result){
                return {
                    success: true,
                    data: result
                };
            }
            return {
                success: false,
                message: "cant not ready"
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async cancelReady(id) {
        try {
            let result = await this.shipperModel.query().update({status: 0}).where('id', id).first();
            if(result){
                return {
                    success: true,
                    data: result
                };
            }
            return {
                success: false,
                message: "cant not cancel ready"
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async cancelReadyBySocketId(socketId) {
        try {
            let result = await this.shipperModel.query()
                .update({status: 0})
                .where('socketId', socketId)
                .where('status', 1);
            return {
                success: true,
                message: 'set shipper status to 0 success'
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

}

module.exports = new ShipperService();