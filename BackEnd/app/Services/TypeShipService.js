const TypeShipModel = require('../Models/TypeShipModel');

class TypeShipService {
    constructor(){
        this.typeShipModel = TypeShipModel;
    }

    async getAll() {
        try {
            const result = await this.typeShipModel.query();

            if(!result) {
                return {
                    message: false,
                    data: null
                }
            }

            return result;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    
    async getAllActive() {
        try {
            const result = await this.typeShipModel.query().where('active', 1);
            
            if(!result) {
                return {
                    message: false,
                    data: null
                }
            }

            return result;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async getById(id) {
        try {
            const result = await this.typeShipModel.query()
                .select('typeships.name as typeName')
                .where('id', id)
                .first();
            if(!result) {
                return {
                    success: false
                }
            }
            return result;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async add(body) {
        try{
            let result = await this.typeShipModel.query()
                .where('name', body.name)
                .first();
            if(result) {
                return {
                    success: false,
                    message: 'DUPLICATE NAME'
                }
            }
            result = await this.typeShipModel.query()
                .insert({name: body.name, price: body.price, active: 1})
            if(!result) {
                return {
                    success: false,
                    message: 'cannot insert'
                }
            }
            else return {
                success: true,
                message: 'insert success',
                data: result
            };
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async deleteById(id) {
        try{
            let result = await this.typeShipModel.query()
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
            const result = await this.typeShipModel.query()
                .update({name: body.name, price: body.price})
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

    async activeById(id, body) {
        try{
            const result = await this.typeShipModel.query()
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
}

module.exports = new TypeShipService();