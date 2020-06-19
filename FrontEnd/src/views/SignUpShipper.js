import React, { Component } from 'react';
import api from '../api';

class SignUpCustomer extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            user: null,
            slcType: '2',
            notify: 0
        };
      }

    onHandleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        const user = this.state.user;
        this.setState({
            user: { ...user, [name]: value },
        });
        if(target.type === 'select-one'){
            if(value === '1'){
                this.props.history.push('/signup/customer');
            }
        }
    }

    onHanldeBackMain = () => {
        this.props.history.push('/login');
    }

    onHandleSubmit = async (event) => {
        event.preventDefault();
        try{
            const username = this.state.user.username;
            const password = this.state.user.password;
            const phoneNumber = this.state.user.phoneNumber;
            const firstname = this.state.user.firstname;
            const lastname = this.state.user.lastname;
            if(this.state.user.password === this.state.user.confirmPassword) {
                const response = await api.post('/shipper/add',
                    { username, password, firstname, lastname, phoneNumber },
                );
                if (response.data.success === true) {
                    this.setState({ notify: 1});
                    window.scrollTo(0,0);
                }
                if (response.data.message === "DUPLICATE USERNAME") {
                    this.setState({ notify: 2});
                    window.scrollTo(0,0);
                }
                else {
                    alert('Fail')
                }
            } else {
                console.log('Fail');
            }
        } catch {
            console.log(Error);
            window.scrollTo(0,0);
        }
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col">
                        <h1>Add Shipper Information</h1>
                        <button
                            className="btn btn-primary"
                            onClick= { this.onHanldeBackMain }
                        ><i className="fa fa-chevron-left" aria-hidden="true" />Home</button>
                        </div>
                        <div className="col mt-2 d-flex justify-content-end flex-wrap">
                        <h3>Type Account</h3><select
                            className="form-control w-30 ml-3"
                            name="slcType"
                            value= { this.state.slcType }
                            onChange={ this.onHandleChange }
                        >
                            <option value={1}>Customer</option>
                            <option value={2}>Shipper</option>
                        </select>
                        </div>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center justify-content-center row">
                    <div className="personal-info w-70">
                        <div className="alert alert-info alert-dismissable">
                            <a href="true" className="panel-close close" data-dismiss="alert">x</a>
                            <i className="fa fa-coffee" />
                            {this.state.notify === 1 ? "Create successful" : 
                            (this.state.notify === 0 ? "Please enter information" :
                            (this.state.notify === 2 ? "Please enter another username" : "Cannot create" ))}
                        </div>
                        <h3>Shipper info</h3>
                        <form className="form-horizontal">
                            <div className="form-group">
                                <label className="col-lg control-label">First name:</label>
                                <div className="col-lg">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="firstname"
                                    onChange={ this.onHandleChange }
                                />
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
                                />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-lg control-label">Phone number:</label>
                                <div className="col-lg">
                                <input
                                    className="form-control"
                                    type="tel"
                                    name="phoneNumber"
                                    onChange={ this.onHandleChange }
                                />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md control-label">Username:</label>
                                <div className="col-md">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="username"
                                    onChange={ this.onHandleChange } />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md control-label">Password:</label>
                                <div className="col-md">
                                <input
                                    className="form-control"
                                    type="password"
                                    name="password"
                                    onChange={ this.onHandleChange } />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-md control-label">Confirm password:</label>
                                <div className="col-md">
                                <input
                                    className="form-control"
                                    name="confirmPassword"
                                    onChange={ this.onHandleChange }
                                    type="password" />
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-center form-group">
                                <div className="d-flex flex-wrap justify-content-center">
                                <button
                                    onClick = { this.onHandleSubmit }
                                    type="submit"
                                    className="btn btn-primary mr-3">Save Changes
                                </button>
                                <span />
                                <button
                                    className="btn btn-dark"
                                    onClick= { this.onHanldeBackMain }
                                    >Cancel
                                </button>
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        );
    }
}

export default SignUpCustomer;
