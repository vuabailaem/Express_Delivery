const jwt = require('jsonwebtoken');

class AuthMiddleware{
    constructor(){}

    authCustomer({req, res, next}){
        const { headers } = req;
        const token = headers.authorization;
        // Check token is exist.
        if(!token){
            return res.json({
                message: 'TOKEN_UNAVAILABLE',
                data: null
            });
        }

        const dataToken = jwt.verify(token, Env.APP_KEY);
        if(dataToken.role === 1) {
            req.customer = dataToken;
        } else {
            return res.json({
                message: 'You\'re not customer',
                data: null
            });
        }
        return next();
    }

    authShipper({req, res, next}){
        const { headers } = req;
        const token = headers.authorization;
        // Check token is exist.
        if(!token){
            return res.json({
                message: 'TOKEN_UNAVAILABLE',
                data: null
            });
        }

        const dataToken = jwt.verify(token, Env.APP_KEY);
        if(dataToken.role === 2) {
            req.shipper = dataToken;
        } else {
            return res.json({
                message: 'You\'re not shipper',
                data: null
            });
        }
        return next();
    }

    authAdmin({req, res, next}){
        const { headers } = req;
        const token = headers.authorization;
        // Check token is exist.
        if(!token){
            return res.json({
                message: 'TOKEN_UNAVAILABLE',
                data: null
            });
        }

        const dataToken = jwt.verify(token, Env.APP_KEY);
        if(dataToken.role === 0) {
            req.admin = dataToken;
        } else {
            return res.json({
                message: 'You\'re not admin',
                data: null
            });
        }
        return next();
    }

}

module.exports = new AuthMiddleware();