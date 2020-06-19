import React, { Component } from 'react';
import api from '../api';
import NavBar from "../components/NavBar";
import {NotificationContainer, NotificationManager} from 'react-notifications';

class mainCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            arrNotify: null,
        }
    }

    fetchUserData = async () => {
        try {
            const response = await api.get('/customer/getMyData', {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });

            if (response.data.success === true) {
                this.setState({ user: response.data.data, isLoading: false });
            } else {
                throw new Error();
            }
        } catch {
            this.props.history.goBack();
        }
    }

    fetchNotification = async () => {
        try {
            const response = await api.get('customer/getMyNotification', {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            });
            if(response.data.success === true) {
            this.setState({ arrNotify: response.data.data });
            } else {
            throw new Error();
            }
        } catch {
            console.log(Error);
        }
    }

    componentDidMount() {
        this.fetchUserData();
        this.fetchNotification();
    }

    onHandleCreateRequest = () => {
        this.props.history.push('/customer/createRequest');
    }

    onHandleMyRequest = () => {
        this.props.history.push('/customer/request');
    }

    onHandleLogout = () => {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }

    onHandleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const user = this.state.user;
        this.setState({
            user: { ...user, [name]: value },
        });
    }

    onHandleSubmit = async (event) => {
        event.preventDefault();
        const password = this.state.user.password;
        const firstname = this.state.user.firstname;
        const lastname = this.state.user.lastname;
        const phoneNumber = this.state.user.phoneNumber;
        if(this.state.user.password === this.state.user.confirmPassword) {
            const response = await api.put('/customer/edit',
                { password, firstname, lastname, phoneNumber },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                },
            );
            if (response.data.success === true) {
                this.setState({ notify: 1});
                window.scrollTo(0,0);
                NotificationManager.success('Update successful.');
            } else {
                NotificationManager.error('Cannot Update profile.');
            }
        } else {
            NotificationManager.error('Password not match.');
        }
    }

    render() {
        return (
            <>
            <NavBar
                onHandleForward = {this.onHandleMyRequest}
                arrNotify={this.state.arrNotify}
                onHandleCreateRequest={this.onHandleCreateRequest}
                onHandleMyRequest={this.onHandleMyRequest}
                onHandleLogout={this.onHandleLogout}
            />
                <div className="container">
                    <NotificationContainer/>
                    <div className="row">
                        <div className="col">
                        <h1>Update Profile Customer <strong className="text-danger">{this.state.user?.username}</strong></h1>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center justify-content-center row">
                    <div className="personal-info w-70">
                        <h3>Personal info</h3>
                        <form className="form-horizontal">
                        <div className="form-group">
                            <label className="col-lg control-label">First name:</label>
                            <div className="col-lg">
                            <input
                                className="form-control"
                                type="text"
                                name="firstname"
                                onChange={ this.onHandleChange }
                                value={ this.state.user?.firstname || "" } />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-lg control-label">Last name:</label>
                            <div className="col-lg">
                            <input
                                className="form-control"
                                type="text"
                                name="lastname"
                                onChange={ this.onHandleChange }
                                value={ this.state.user?.lastname || "" } />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md control-label">Password:</label>
                            <div className="col-md">
                            <input
                                className="form-control"
                                type="password"
                                name="password"
                                onChange={ this.onHandleChange }
                                value={ this.state.user?.password || "" } />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md control-label">Confirm password:</label>
                            <div className="col-md">
                            <input
                                className="form-control"
                                type="password"
                                name="confirmPassword"
                                onChange={ this.onHandleChange }
                                value={ this.state.user?.confirmPassword || "" } />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center form-group">
                            <div className="d-flex flex-wrap justify-content-center">
                            <button
                                onClick = { this.onHandleSubmit }
                                type="submit"
                                className="btn btn-primary mr-3">Save Changes
                            </button>
                            </div>
                        </div>
                        </form>
                    </div>
                    </div>
                </div>
                <hr />
            </>
        );
    }
}

export default mainCustomer;
