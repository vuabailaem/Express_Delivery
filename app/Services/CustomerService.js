const CustomersModel = require('../Models/CustomersModel');

class CustomerService {
    constructor(){
        this.customersModel = CustomersModel;
    }
    
    async getAll() {
        try {
            let result = await this.customersModel.query();
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

    async add(body) {
        try{
            let customer = await this.customersModel.query()
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


}

module.exports = new CustomerService();