import React, { Component } from 'react';
import api from '../api';
import NavBar from '../components/NavBar';

class editShipper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            notify: 0
        }
    }

    fetchUserData = async () => {
        try {
            const response = await api.get('/admin/shipper/getData/' + this.props.match.params.id, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });

            if (response.data.data) {
                this.setState({ user: response.data.data, isLoading: false });
            } else {
                throw new Error();
            }
        } catch {
            // this.props.history.goBack();
        }
    }

    componentDidMount() {
        this.fetchUserData(parseInt(this.props.match.params.id));
    }

    onHandleHome = () => {
        this.props.history.push('/login');
    }

    onHandleLogout = () => {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }

    onHandleUsers = () => {
        this.props.history.push('/admin/users');
    }

    onHandleTypeShip = () => {
        this.props.history.push('/admin/typeShip');
    }

    onHandleRequests = () => {
        this.props.history.push('/admin/Requests');
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
        const username = this.state.user.username;
        const password = this.state.user.password;
        const firstname = this.state.user.firstname;
        const lastname = this.state.user.lastname;
        const phoneNumber = this.state.user.phoneNumber;
        if(this.state.user.password === this.state.user.confirmPassword) {
            const response = await api.put('/admin/shipper/edit/' + this.state.user.id, 
                { username, password, firstname, lastname, phoneNumber },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                },
            );
            if (response.data.success === true) {
                this.setState({ notify: 1});
                window.scrollTo(0,0);
            } else {
                throw new Error();
            }
        } else {
            console.log('Fail');
            window.scrollTo(0,0);
        }
    }

    render() {
        return (
            <>
            <NavBar
                onHandleHome={this.onHandleHome}
                onHandleUsers = {this.onHandleUsers}
                onHandleTypeShip = {this.onHandleTypeShip}
                onHandleRequests = {this.onHandleRequests}
                onHandleLogout = {this.onHandleLogout}
            />
                <div className="container">
                    <div className="row">
                        <div className="col">
                        <h1>Edit Profile Shipper</h1>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center justify-content-center row">
                    <div className="personal-info w-70">
                        <div className="alert alert-info alert-dismissable">
                            <a href="true" className="panel-close close" data-dismiss="alert">x</a>
                            <i className="fa fa-coffee" />
                            {this.state.notify === 1 ? "Update profile successful" :
                            (this.state.notify === 0 ? "Please enter profile's information" : "Cannot update profile" )}
                        </div>
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
                            <label className="col-lg control-label">Phone Number:</label>
                            <div className="col-lg">
                            <input
                            className="form-control"
                            type="text"
                            name="phoneNumber"
                            onChange={ this.onHandleChange }
                            value={ this.state.user?.phoneNumber || "" } />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md control-label">User Name:</label>
                            <div className="col-md">
                            <input
                            className="form-control"
                            type="text"
                            name="username"
                            onChange={ this.onHandleChange }
                            value={ this.state.user?.username || "" } />
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
                            <div className="d-flex justify-content-center flex-wrap">
                            <button
                            onClick = { this.onHandleSubmit }
                            type="submit"
                            className="btn btn-primary mr-3">Save Changes</button>
                            <span />
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

export default editShipper;
