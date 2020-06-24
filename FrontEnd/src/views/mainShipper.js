import React, { Component } from 'react';
import io from 'socket.io-client';
import api from '../api';
import Star from "../components/Star";
import NavBar from '../components/NavBar';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class mainShipper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            isShowButtonReady: 1,
            request: null,
            modalOpened: false,
            typeShipName: "",
            position: null,
        }
    }

    fetchUserData = async () => {
        try {
            const response = await api.get('/shipper/getMyData', {
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
            this.props.history.goBack();
        }
    }

    openWebsocket = () => {
        this.socket = io('http://localhost:3000');
        this.socket.on('newRequest', async (request) => {
            this.setState({request: request.result})
            this.onOpenModal()
            const response = await api.get('/typeShip/getName/' + this.state.request.typeShipId);
            this.setState({typeShipName: response.data.typeName});
        });
    }

    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.savePosition);
        } else { 
            alert("Geolocation is not supported by this browser.");
        }
    }
    savePosition = (position) => {
        this.setState({
            position: { lat: position.coords.latitude, lng: position.coords.longitude }
        });
    }

    onHandleConfirm = () => {
        const token = localStorage.getItem('token');
        this.socket.emit('acceptRequest', [this.state.request, token]);
        this.props.history.push({
            pathname: '/shipper/delivery',
            state: { request: this.state.request}
        });
    }

    onHandleDeclineRequest = () => {
        this.socket.emit('declineRequest', this.state.request);
        this.setState({ modalOpened: false });
    }

    componentDidMount() {
        this.onHandleShowButton();
        this.openWebsocket();
    }

    onHandleShowButton = async () => {
        await this.fetchUserData();
        if(this.state.user.status === 1) {
            this.setState({ isShowButtonReady: 0 });
        }
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

    onhandleReady = async (id) => {
        this.getLocation();
        const response = await api.put('/shipper/readyShip', {id},
            {
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            },
        );
        if (response.data.success === true) {
            this.setState({ isShowButtonReady: 2 });
            const token = localStorage.getItem('token');
            this.socket.emit('readyShip', [token, this.state.position]);
        } else {
            alert('Fail');
        }
    }

    onhandleCancelReady = async (id) => {
        const response = await api.put('/shipper/cancelReady', {id},
            {
                headers: {
                    Authorization: localStorage.getItem('token'),
                }
            },
        );
        if (response.data.success === true) {
            this.setState({isShowButtonReady: 1})
        } else {
            alert('Fail');
        }
        this.socket.emit('disconnect');
    }

    onOpenModal = () => {
        this.setState({ modalOpened: true });
    }

    onCloseModal = () => {
        this.setState({ modalOpened: false });
    }

    onHandleHome = () => {
        this.props.history.push('/login');
    }

    onHandleSubmit = async (event) => {
        event.preventDefault();
        const username = this.state.user.username;
        const password = this.state.user.password;
        const firstname = this.state.user.firstname;
        const lastname = this.state.user.lastname;
        const phoneNumber = this.state.user.phoneNumber;
        if(this.state.user.password === this.state.user.confirmPassword) {
            const response = await api.put('/shipper/edit',
                { username, password, firstname, lastname, phoneNumber },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    }
                },
            );
            if (response.data.success === true) {
                NotificationManager.success('Update successful', '');
                window.scrollTo(0,0);
            } else {
                NotificationManager.error('Cannot update', '');
                window.scrollTo(0,0);
            }
        } else {
            alert('Fail');
        }
    }

    render() {
        return (
            <>
            <NavBar
                onHandleHome = {this.onHandleHome}
                onHandleLogout = {this.onHandleLogout}
            />
                <div className="container">
                    <NotificationContainer />
                    <div className="row">
                        <div className="col">
                        <h1>Update Profile Shipper</h1>
                        </div>
                        <div className="col-2 mt-2">
                            { this.state.isShowButtonReady === 1 ? <button
                                className="btn btn-lg btn-primary mr-3"
                                onClick = { () => this.onhandleReady(this.state.user.id) }
                            >Ready</button> :
                            <button
                                className="btn btn-lg btn-danger mr-3"
                                onClick = { () => this.onhandleCancelReady(this.state.user.id) }
                            >STOP</button>}
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
                                className="btn btn-primary mr-3">Save Changes
                            </button>
                            <span />
                            </div>
                        </div>
                        </form>
                        <p className="col-lg control-label"><strong>Star Rate: </strong>
                            <Star starsCount={this.state.user?.starsCount} />
                        </p>
                    </div>
                    </div>
                    <div
                        className={`modal fade ${this.state.modalOpened ? 'show' : ''}`}
                        style={{ display: this.state.modalOpened ? 'block' : 'none' }}
                    >
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Some customer sent request</h5>
                            <button type="button" className="close" onClick={this.onCloseModal}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="col-lg control-label"><strong>Id: </strong>{this.state.request?.id}</p>
                            <p className="col-lg control-label"><strong>Customer's Name: </strong>{this.state.request?.customerName}</p>
                            <p className="col-lg control-label"><strong>Type Ship: </strong>{this.state.typeShipName}</p>
                            <p className="col-lg control-label"><strong>Start: </strong>{this.state.request?.start}</p>
                            <p className="col-lg control-label"><strong>Destination: </strong>{this.state.request?.destination}</p>
                            <p className="col-lg control-label"><strong>Receiver: </strong>{this.state.request?.receiver}</p>
                            <p className="col-lg control-label"><strong>Phone Number's Receiver: </strong>{this.state.request?.phoneReceiver}</p>
                            <p className="col-lg control-label"><strong>Note: </strong>{this.state.request?.note}</p>
                            <p className="col-lg control-label"><strong>Distance: </strong>{this.state.request?.length} km</p>
                            <p className="col-lg control-label"><strong>Cost: </strong>{this.state.request?.cost} VND</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={this.onHandleConfirm }
                            >Accept</button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={ this.onHandleDeclineRequest }
                            >Decline Request</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <hr />
            </>
        );
    }
}

export default mainShipper;
