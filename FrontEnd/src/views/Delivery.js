import React, { Component } from 'react';
import NavBar from "../components/NavBar";
import io from 'socket.io-client';

class Delivery extends Component {
    constructor(props) {
        super(props);
        this.state = {
            request: null,
        }
    }
    openWebsocket = () => {
        this.socket = io('http://localhost:3000');
    }

    componentDidMount() {
        this.openWebsocket();
        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC58Pa1xnAA7rcKkgAcwX28G0-gyWLpryU&callback=initMap";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.onHandleInitRequest();
        setTimeout(()=> {
            window.calculateAndDisplayRoute();
        },1000)
    }

    onHandleInitRequest = async () => {
        await this.setState({request: this.props.location.state.request});
        // window.calculateAndDisplayRoute();
        // console.log(this.state.request);
    }

    onHandleComplete = () => {
        const token = localStorage.getItem('token');
        this.socket.emit('requestComplete', [this.state.request, token]);
        this.props.history.push('/shipper');
    }

    onHandleCancelRequest = () => {
        const token = localStorage.getItem('token');
        this.socket.emit('requestCancel', [this.state.request, token]);
        this.props.history.push('/shipper');
    }
    
    onHandleLogout = () => {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }

    onHandleHome = () => {
        this.props.history.push('/login');
    }

    render () {
        return (
            <>
            <NavBar
                onHandleHome = {this.onHandleHome}
                onHandleLogout = {this.onHandleLogout}
            />
            <div className="container">
                <div className="d-flex justify-content-center row mt-5">
                    <h1>Delivery</h1>
                </div>
                <div className="d-flex flex-column align-items-center mt-5">
                    <div className="mb-4">
                    <h5 className="col-lg control-label"><strong>Id: </strong>{this.state.request?.id}</h5>
                    <p className="col-lg control-label"><strong>Customer's Name: </strong>{this.state.request?.customerName}</p>
                    <p className="col-lg control-label"><strong>Type Ship: </strong>{this.state.request?.typeShipName}</p>
                    <p className="col-lg control-label"><strong>Start: </strong>{this.state.request?.start}</p>
                    <p className="col-lg control-label"><strong>Destination: </strong>{this.state.request?.destination}</p>
                    <p className="col-lg control-label"><strong>Receiver: </strong>{this.state.request?.receiver}</p>
                    <p className="col-lg control-label"><strong>Phone Number's Receiver: </strong>{this.state.request?.phoneReceiver}</p>
                    <p className="col-lg control-label"><strong>Note: </strong>{this.state.request?.note}</p>
                    <p className="col-lg control-label"><strong>Distance: </strong>{this.state.request?.length} km</p>
                    <p className="col-lg control-label"><strong>Cost: </strong>{this.state.request?.cost} VND</p>
                    <button
                        className="btn btn-success mr-3"
                        onClick={this.onHandleComplete}
                    >Complete</button>
                    <button
                        className="btn btn-secondary"
                        onClick={this.onHandleCancelRequest}
                    >Cancel Request</button>
                    </div>
                </div>
                <h6 id="directions-panel"></h6>
                <div className="form-group row">
                    <input type="hidden" className="form-control" id="start" value={this.state.request?.start} />
                    <input type="hidden" className="form-control" id="end" value={this.state.request?.destination} />
                    <label className="col-sm-2 col-form-label">map: </label>
                    <div className="col-sm-10 field-unit__field">
                    <div id="map" style={{height: '480px'}} className="col-sm-10" />
                    </div>
                </div>
            </div>
            </>
        );
    }
}

export default Delivery;