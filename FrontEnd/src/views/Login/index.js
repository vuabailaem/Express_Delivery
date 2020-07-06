import React, { Component } from 'react';
import api from '../../api';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Login extends Component {
    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            username: 'tuanlm3',
            password: '123',
            slcType: "1"
        };
    this.onHandleChange = this.onHandleChange.bind(this);
    }

    getRole = async () => {
        try {
            const response = await api.get('/auth/getRole', {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            if(response.data.data === "0"){
                this.props.history.push('/admin/users');
            }
            if(response.data.data === "1"){
                this.props.history.push('/customer');
            }
            if(response.data.data === "2"){
                this.props.history.push('/shipper');
            } else {
                throw new Error();
            }
        } catch {
            console.log('Fail');
        }
    }

    componentDidMount() {
        this.getRole();
    }

    onHandleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked: target.value;
        this.setState({
            [name]: value,
        });
    }


    onHandleSubmit = async (event) => {
        event.preventDefault();
        const username = this.state.username;
        const password = this.state.password;
        const role = this.state.slcType;
        try {
            const response = await api.post('/auth/login', { username, password, role });

            const { token } = response.data;
            
            if(token) {
                localStorage.setItem('token', token);
                switch (role){
                    case '0':{
                        this.props.history.push('/admin/users');
                        break;
                    }
                    case '1':{
                        this.props.history.push('/customer');
                        break;
                    }
                    case '2':{
                        this.props.history.push('/shipper');
                        break;
                    }
                    default:break;
                }
            } else {
                throw new Error;
            }
        } catch (err) {
            NotificationManager.error('Cannot login.','', 2000);
            window.scrollTo(0,0);
        }
    }

    onHanldeBackMain = () => {
        this.props.history.push('/');
    }

    render() {
        return (
    <div className="align-center">
        <NotificationContainer/>
        <div className="fixCenter">
            <div className="">
                <div className="d-flex justify-content-center row">
                    <h1>Login</h1>
                </div>
                <div className="row">
                    <div className="form-group">
                        <div className="row mt-1">
                            <label className="lead">UserName</label>
                        </div>
                        <div className="row mt-1">
                            <input
                                type="text"
                                className="form-control"
                                aria-describedby="emailHelpId"
                                name="username"
                                value={ this.state.username }
                                onChange= { this.onHandleChange }
                            />
                        </div>
                        <div className="row mt-1">
                            <label className="lead">Password</label>
                        </div>
                        <div className="row mt-1">
                            <input
                                type="password"
                                className="form-control"
                                aria-describedby="HelpId"
                                name="password"
                                value={ this.state.password }
                                onChange= { this.onHandleChange }
                            />
                        </div>
                        <div className="row mt-1">
                            <label className="lead">Type account</label>
                        </div>
                        <div className="row mt-1">
                            <select
                                className="form-control"
                                name="slcType"
                                value= { this.state.slcType }
                                onChange = { this.onHandleChange }
                            >
                                <option value={0}>Admin</option>
                                <option value={1}>Customer</option>
                                <option value={2}>Shipper</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-center row mt-3">
                            <button
                                className="btn btn-primary w-100" 
                                type="submit"
                                disabled={(this.state.username === '' || this.state.password === '')
                                ?true :false}
                                onClick={ this.onHandleSubmit }
                            >
                                Login
                            </button>
                            <button
                                className="btn btn-dark w-100 mt-3"
                                onClick= { this.onHanldeBackMain }
                                >Cancel
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
        );
    }
}

export default Login;