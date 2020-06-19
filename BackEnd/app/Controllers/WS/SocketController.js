const jwt = require('jsonwebtoken');
const shipperService = require('../../Services/ShipperService');
const customerService = require('../../Services/CustomerService');
const requestService = require('../../Services/RequestsService');
const notificationService = require('../../Services/NotificationService');
const common = require('../../Common/DistanceCommon');

var shipperSocketId;

const SocketController = (io) => {
    io.on('connection', async (socket) => {
        let shippers;

        socket.on('createRequestXYZ', async ([]) => {
            socket.broadcast.to(shipperSocketId).emit('newRequest', ({ message: 'new request' }));
        });

        //listen create Request
        socket.on('createRequest', async ([token, dataRequest, customerName]) => {
            //get all ready shippers
            shippers = await shipperService.getAllReady();

            //define user
            const user = jwt.verify(token, Env.APP_KEY);
            let customer = {
                userId: user.id,
                customerName: user.customerName,
                socketId: socket.id
            };

            if(shippers.length === 0) {
                // case no shipper ready
                socket.emit('noOne');
            } else {
                //insert request to DB
                let request = {
                    customerId: customer.userId,
                    customerName: user.customerName,
                    typeShipId: dataRequest.typeShipId,
                    note: dataRequest.note,
                    start: dataRequest.start,
                    destination: dataRequest.destination,
                    receiver: dataRequest.receiver,
                    phoneReceiver: dataRequest.phoneReceiver,
                    latStart: dataRequest.latStart,
                    lngStart: dataRequest.lngStart,
                    length: dataRequest.length,
                    cost: dataRequest.cost,
                    status: 1
                };
                const insert = await requestService.createRequest(request);
                const nearest = common.findTheNearest({lat: dataRequest.latStart, lng: dataRequest.lngStart}, shippers);
                request = await requestService.getById(insert.id);
                // emit to nearest shipper
                socket.broadcast.to(nearest.socketId).emit('newRequest', (request));
            }
        });

        //shipper ready to ship
        socket.on('readyShip', async ([token, position]) => {
            shipperSocketId = socket.id;
            //define shipper by verify token
            const user = jwt.verify(token, Env.APP_KEY);
            let shipper = {
                userId: user.id,
                shipperName: user.shipperName,
                socketId: socket.id,
                lat: position.lat.toString(), // parse to String because of number's length
                lng: position.lng.toString()
            };
            await shipperService.updateSocketIdAndPosition(shipper.userId, shipper);
        });

        socket.on('updateSocketId', async (token) => {
            //define shipper by verify token
            const user = jwt.verify(token, Env.APP_KEY);
            await customerService.updateSocketIdOfCustomer(user.id, socket.id);
        });

        //shipper accept request
        socket.on('acceptRequest', async ([request, token]) => {
            const user = jwt.verify(token, Env.APP_KEY);
            let shipper = {
                userId: user.id,
                shipperName: user.userName,
                socketId: socket.id
            };
            //update DB acceptBy
            await requestService.shipperAccept(shipper.userId, request.id);
            let dataShipper = await shipperService.getData(shipper.userId);
            // console.log('shipper', shipper);
            const customer = await customerService.getData(request.customerId);
            socket.broadcast.to(customer.data.socketId).emit('shipperAccepted', (dataShipper.data));
        });

        //shipper DECLINE request
        socket.on('declineRequest', async (request) => {
            // console.log('shipper declined');
            // response to customer
            const customer = await customerService.getData(request.customerId);
            socket.broadcast.to(customer.data.socketId).emit('shipperDeclined');
        });

        //shipper COMPLETE request
        socket.on('requestComplete', async ([request, token]) => {
            const user = jwt.verify(token, Env.APP_KEY);
            let shipper = {
                userId: user.id,
                shipperName: user.shipperName,
                socketId: socket.id
            };
            // set request complete
            let result = await requestService.requestComplete(request.id);
            // insert into notification table
            await notificationService.insertRequestCompleted(request.id);
            // response to customer request has completed
            if(result) {
                // get request by ID
                let requestDone = await requestService.getRequestCustomer(request.id);
                await socket.broadcast.to(requestDone.data[0].socketId).emit('newNotification', (request));
                await socket.broadcast.to(requestDone.data[0].socketId).emit('updateCompletedRequest', (request));
            }
            // set shipper free
            await shipperService.cancelReady(shipper.userId);
        });

        //shipper CANCEL request
        socket.on('requestCancel', async ([request, token]) => {
            const user = jwt.verify(token, Env.APP_KEY);
            let shipper = {
                userId: user.id,
                shipperName: user.shipperName,
                socketId: socket.id
            };
            // set request cancel
            let result = await requestService.requestCancel(request.id);
            // insert into notification table
            await notificationService.insertRequestFalse(request.id);
            // response to customer request has completed
            if(result) {
                // get request by ID
                let requestDone = await requestService.getRequestCustomer(request.id);
                await socket.broadcast.to(requestDone.data[0].socketId).emit('newFalse', (request));
                await socket.broadcast.to(requestDone.data[0].socketId).emit('updateCompletedFalse', (request));
            }
            // set shipper free
            await shipperService.cancelReady(shipper.userId);
        });


        //listen shipper disconnect
        socket.on('disconnect', async () => {
            // console.log('disconnect: ', socket.id);
            // UPDATE DB SHIPPERS STATUS NOT READY : 0
            await shipperService.cancelReadyBySocketId(socket.id);
        });
    });
};

module.exports = {
    SocketController
};
