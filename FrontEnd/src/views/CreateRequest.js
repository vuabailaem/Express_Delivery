import React, { Component } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import io from 'socket.io-client';
import $ from 'jquery';
import NavBar from "../components/NavBar";
import api from '../api';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ModalAcp from '../components/ModalRequestAcp';
import ModalCancel from '../components/ModalRequestCancle'
import ModalComplete from '../components/ModalRequestComplete'

class CreateRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeShipId: "2",
            receiver: "",
            phoneNumber: "",
            note: "",
            startAddress: '',
            endAddress: '',
            lat: 0,
            lng: 0,
            length: 0,
            cost: 0,
            modalAcpOpened: false,
            modalCancelOpened: false,
            modalCompleteOpened: false,
            dataShipper: null,
        }
    }
    
    fetchTypeShipData = async () => {
        try {
            const response = await api.get('/typeShip/getAllActive');

            if (response.data) {
                this.setState({ shipTypes: response.data });
            } else {
                throw new Error();
            }
        } catch {
            this.props.history.goBack();
        }
    }

    fetchNotification = async () => {
        try {
          const response = await api.get('/customer/getMyNotification', {
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

    onHandleHome = () => {
        this.props.history.push('/login');
    }

    onHandleLogout = () => {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }

    onHandleMyRequest = () => {
        this.props.history.push('/customer/request');
    }


    onHandleCheckNoti = async() => {
        const response = api.put('/customer/checkedNotifications',{
            headers: {
                Authorization: localStorage.getItem('token'),
            }
        })
    }

    onCloseModal = () => {
        this.setState({modalAcpOpened: false, modalCancelOpened: false, modalCompleteOpened: false});
    }

    handleStartAddressChange = startAddress => {
        this.setState({ startAddress });
        // console.log({ startAddress });
    };

    handleEndAddressChange = endAddress => {
        this.setState({ endAddress });
    };

    openWebsocket = () => {
        this.socket = io('http://localhost:3000');
        this.socket.on('noOne', () => {
            NotificationManager.error('No Shipper available.');
        });
        this.socket.on('shipperAccepted', (data) => {
            this.setState({dataShipper: data, modalAcpOpened: true});
        });
        this.socket.on('shipperDeclined', () => {
            this.setState({modalCancelOpened: true});
        });
        this.socket.on('newFalse', () => {
            this.setState({modalCancelOpened: true});
            this.fetchNotification();
        });
        this.socket.on('newNotification', () => {
            this.setState({modalCompleteOpened: true});
            this.fetchNotification();
        })
    }

    handleCreateRequest = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const dataRequest = {
            typeShipId: this.state.typeShipId,
            note: this.state.note,
            start: this.state.startAddress,
            destination: this.state.endAddress,
            receiver: this.state.receiver,
            phoneReceiver: this.state.phoneNumber,
            latStart: this.state.lat,
            lngStart: this.state.lng,
            length: this.state.length,
            cost: this.state.cost
        };
        if(dataRequest.length != 0) {
            this.socket.emit('createRequest', [token, dataRequest]);
            NotificationManager.success('Request has been created.');
        } else {
            NotificationManager.warning('Please enter full information.');
        }
        this.socket.emit('updateSocketId', token);
    }

    componentDidMount() {
        // lay thong tin shipper
        // neu shipper dang ready thi cap nhat socketId va lat lng cua shipper
        this.fetchTypeShipData();
        this.openWebsocket();
        this.fetchNotification();
        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyC58Pa1xnAA7rcKkgAcwX28G0-gyWLpryU&callback=initMap";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    onHandleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
           [name]: value,
        });
    }

    calculateAndDisplayRoute = async (event) => {
        event.preventDefault();
        const resultA = await window.calculateAndDisplayRoute();
        const resultB = await window.codeAddress();
        if(resultA.status !== 'OK' || !!resultB === false) {
            NotificationManager.error('Invalid Address.');
        }
        const lat = $("#gg-lat").val();
        const lng = $("#gg-lng").val();
        this.setState({
            lat, lng,
            length: window.length,
        });
        this.state.shipTypes.forEach(element => {
            if(element.id == this.state.typeShipId){
                this.setState({
                    cost: element.price * window.length,
                });
            }
        });
    }

    render() {
        return (
            <>
            <NavBar
                onHandleCheckNoti = {this.onHandleCheckNoti}
                arrNotify={this.state.arrNotify}
                onHandleHome={this.onHandleHome}
                onHandleMyRequest={this.onHandleMyRequest}
                onHandleLogout={this.onHandleLogout}
            />
            <div className="container">
                <NotificationContainer/>
                <ModalAcp
                    onCloseModal={this.onCloseModal}
                    modalOpened={this.state.modalAcpOpened}
                    dataShipper={this.state.dataShipper}
                />
                <ModalCancel
                    onCloseModal={this.onCloseModal}
                    modalOpened={this.state.modalCancelOpened}
                    dataShipper={this.state.dataShipper}
                />
                <ModalComplete
                    onCloseModal={this.onCloseModal}
                    modalOpened={this.state.modalCompleteOpened}
                    dataShipper={this.state.dataShipper}
                />
            <div className="CenterColumn">
            <h1>Input Your Information Request</h1>
            <form className="form-horizontal w-70">
            <div className="form-group">
                <label className="col-lg-3 control-label">Type Ship:</label>
                <div className="col-lg">
                <div className="ui-select">
                    <select
                    name="typeShipId"
                    value = {this.state.typeShipId}
                    onChange={this.onHandleChange}
                    className="form-control">
                        {(this.state.shipTypes || []).map((type) => (
                            <option value={type.id} key={type.id}>
                                {type.name} - {type.price} VND per kilometer
                            </option>
                        ))}
                    </select>
                </div>
                </div>
            </div>
            <div className="form-group">
                <label className="col-lg-3 control-label">Receiver:</label>
                <div className="col-lg">
                <input
                    className="form-control"
                    type="text"
                    name="receiver"
                    onChange = {this.onHandleChange}
                />
                </div>
            </div>
            <div className="form-group">
                <label className="col-lg-3 control-label">Receiver Phone Number:</label>
                <div className="col-lg">
                <input
                    className="form-control"
                    type="text"
                    name="phoneNumber"
                    onChange = {this.onHandleChange}
                />
                </div>
            </div>
            <div className="form-group">
                <label className="col-lg-3 control-label">Start Place:</label>
                <div className="col-lg">
                    <PlacesAutocomplete
                        value={this.state.startAddress}
                        debounce={700}
                        onChange={this.handleStartAddressChange}
                        onSelect={this.handleStartAddressChange}
                    >
                        {({ loading, getInputProps, getSuggestionItemProps, suggestions }) => (
                            <div className="autocomplete-root">
                                <input id="start" className="form-control" {...getInputProps()} />
                                <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => (
                                    <div
                                        className="fixDivSpanOfGGMap p1"
                                        {...getSuggestionItemProps(suggestion)}
                                    >
                                    <span>{suggestion.description}</span><br/>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
                </div>
            </div>
            <div className="form-group">
                <label className="col-lg-3 control-label">Final Destination:</label>
                <div className="col-lg">
                <PlacesAutocomplete
                        value={this.state.endAddress}
                        debounce={700}
                        onChange={this.handleEndAddressChange}
                        onSelect={this.handleEndAddressChange}
                    >
                        {({ loading, getInputProps, getSuggestionItemProps, suggestions }) => (
                            <div className="autocomplete-root">
                                <input id="end" className="form-control" {...getInputProps()} />
                                <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => (
                                    <div
                                        className="fixDivSpanOfGGMap p1"
                                        {...getSuggestionItemProps(suggestion)}
                                    >
                                    <span>{suggestion.description}</span><br/>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>
                </div>
            </div>
            <div className="form-group">
                <label className="col-md-3 control-label">Note for shipper:</label>
                <div className="col-md">
                <textarea
                    className="form-control"
                    rows="3"
                    name="note"
                    onChange = {this.onHandleChange}
                ></textarea>
                </div>
            </div>
            <h6 id="directions-panel"></h6>
            <div className="form-group">
                <h3>Cost: { this.state.cost.toFixed(0) } VND</h3>
                <h3>Distance: {this.state.length.toFixed(1)} km</h3>
            </div>
            <label className="col-sm-2 col-form-label">Map: </label>
            <div className="form-group row">
                <input type="hidden" className="form-control" id="gg-lat" />
                <input type="hidden" className="form-control" id="gg-lng" />
                <div className="col-sm field-unit__field">
                <div id="map" style={{height: '480px'}} className="col-sm" />
                </div>
            </div>
            <div className="form-group">
                <div className="col-md d-flex justify-content-center">
                <button
                    className="btn btn-success"
                    onClick={this.calculateAndDisplayRoute}
                >Show direction</button>
                </div>
            </div>
            <div className="form-group">
                <div className="col-md d-flex justify-content-center">
                <button
                    disabled={(this.state.receiver === ''
                        || this.state.phoneNumber === ''
                        || this.state.startAddress === ''
                        || this.state.endAddress === ''
                        || this.state.note === ''
                        || this.state.length === (0||1))
                    ?true:false}
                    onClick={this.handleCreateRequest}
                    className="btn btn-primary mr-3"
                >Send Request</button>
                <span />
                <button
                    className="btn btn-dark"
                    onClick={this.onHandleHome}
                >Cancel</button>
                </div>
            </div>
            </form>
            </div>
        </div>
        </>
        );
    }
}

export default CreateRequest;
