const CustomersModel = require('../Models/CustomersModel');
const jwt = require('jsonwebtoken');
class AuthService {
    constructor(){
        this.CustomersModel = CustomersModel;
    }
    //customer login
    async login(body) {
        try {
            let result = await this.customersModel.query()
                .where('username', body.username)
                .where('password', body.password)
            if(result.active === 0) {
                return {
                    success: false,
                    message: 'Your account has been disable!'
                }
            }
            if(result) {
                let token = jwt.sign({
                    id: result.id,
                    customerName: result.username,
                    timestamp: new Date().getTime()
                }, Env.APP_KEY, {expiresIn: '7d'});
                return {
                    success: true,
                    data: result,
                    token
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