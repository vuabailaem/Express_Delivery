const CustomersModel = require('../Models/CustomersModel');
const ShippersModel = require('../Models/ShippersModel');
const AdminModel = require('../Models/AdminModel');
const jwt = require('jsonwebtoken');
class AuthService {
    constructor(){
        this.customersModel = CustomersModel;
        this.shippersModel = ShippersModel;
        this.adminModel = AdminModel;
    }
    async login(body) {
        if(body.role === '0'){
            try {
                let result = await this.adminModel.query()
                    .where('username', body.username)
                    .where('password', body.password)
                    .where('role', body.role)
                    .first();

                if (result) {
                    if (result.active === 0) {
                        return {
                            success: false,
                            message: 'Your account has been disable!'
                        }
                    }

                    let token = jwt.sign({
                        id: result.id,
                        userName: result.username,
                        role: result.role,
                        timestamp: new Date().getTime()
                    }, Env.APP_KEY, {expiresIn: '7d'});
                    return {
                        success: true,
                        data: result,
                        token,
                        message:'Customer'
                    };
                }
                return {
                    success: false,
                    message: "cannot login"
                }
            } catch(e) {
                console.log(e);
                throw(e);
            }
        }

        if(body.role === '1'){
            try {
                let result = await this.customersModel.query()
                    .where('username', body.username)
                    .where('password', body.password)
                    .where('role', body.role)
                    .first();

                if (result) {
                    if (result.active === 0) {
                        return {
                            success: false,
                            message: 'Your account has been disable!'
                        }
                    }

                    let token = jwt.sign({
                        id: result.id,
                        userName: result.username,
                        role: result.role,
                        timestamp: new Date().getTime()
                    }, Env.APP_KEY, {expiresIn: '7d'});
                    return {
                        success: true,
                        data: result,
                        token,
                        message:'Customer'
                    };
                }
                return {
                    success: false,
                    message: "cannot login"
                }
            } catch(e) {
                console.log(e);
                throw(e);
            }
        }

        if(body.role === '2'){
            try {
                let result = await this.shippersModel.query()
                    .where('username', body.username)
                    .where('password', body.password)
                    .where('role', body.role)
                    .first();

                if (result) {
                    if (result.active === 0) {
                        return {
                            success: false,
                            message: 'Your account has been disable!'
                        }
                    }

                    let token = jwt.sign({
                        id: result.id,
                        userName: result.username,
                        role: result.role,
                        timestamp: new Date().getTime()
                    }, Env.APP_KEY, {expiresIn: '7d'});
                    return {
                        success: true,
                        data: result,
                        token,
                        message:'Shipper'
                    };
                }
                return {
                    success: false,
                    message: "cannot login"
                }
            } catch(e) {
                console.log(e);
                throw(e);
            }
        }
    }

    async getRole(token) {
        if(!token){
            return {
                message: 'TOKEN_UNAVAILABLE',
                data: null
            };
        }
        const dataToken = jwt.verify(token, Env.APP_KEY);
        const role = dataToken.role;
        if(role || role === 0) {
            return {
                message: 'This is role',
                data: role
            };
        } else {
            return {
                message: 'TOKEN_UNAVAILABLE',
                data: null
            };
        }
    }
}

module.exports = new AuthService();