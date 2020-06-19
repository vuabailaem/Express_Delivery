import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import main from '../views/main';
import Login from '../views/Login';
import SignUpCustomer from '../views/SignUpCustomer';
import SignUpShipper from '../views/SignUpShipper';
import mainCustomer from '../views/mainCustomer';
import mainShipper from '../views/mainShipper';
import Delivery from '../views/Delivery';
import mainAdmin from '../views/mainAdmin';
import createRequest from '../views/CreateRequest';
import customerRequest from '../views/customerRequest';
import editShipper from '../views/editShipper';
import editCustomer from '../views/editCustomer';
import adminTypeShip from '../views/adminTypeShip';
import adminRequests from '../views/adminRequests';

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={main} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup/customer" component={SignUpCustomer} />
                <Route exact path="/signup/shipper" component={SignUpShipper} />
                <Route exact path="/customer" component={mainCustomer} />
                <Route exact path="/customer/request" component={customerRequest} />
                <Route exact path="/shipper" component={mainShipper} />
                <Route exact path="/shipper/delivery" component={Delivery} />
                <Route exact path="/admin/edit/shipper/:id" component={editShipper} />
                <Route exact path="/admin/edit/customer/:id" component={editCustomer} />
                <Route exact path="/admin/users" component={mainAdmin} />
                <Route exact path="/admin/typeship" component={adminTypeShip} />
                <Route exact path="/admin/requests" component={adminRequests} />
                <Route exact path="/customer/createRequest" component={createRequest} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;