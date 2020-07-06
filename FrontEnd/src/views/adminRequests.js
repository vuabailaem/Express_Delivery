import React, { Component } from 'react';
import api from '../api';
import NavBar from '../components/NavBar';
import Star from "../components/Star";
import {NotificationContainer, NotificationManager} from 'react-notifications';

class adminRequests extends Component {
    constructor(props) {
      super(props);
      this.state = {
          arrRequests: null,
          modalOpened: false,
          request:null,
          index: 0,
          requestId: 0,
      }
    }

    fetchRequetsData = async () => {
      try {
          const response = await api.get('/admin/getAllRequests', {
              headers: {
                  Authorization: localStorage.getItem('token'),
              },
          });
          if (response.data.data) {
              this.setState({ arrRequests: response.data.data });
          } else {
            throw new Error();
        }
      } catch {
          console.log(Error);
      }
  }

    componentDidMount() {
      this.fetchRequetsData();
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

    onOpenModal = (request,index) => {
      this.setState({modalOpened: true, request: {...request}, index: index + 1, requestId: request.id});
    }

    onCloseModal = () => {
      this.setState({modalOpened: false});
    }

    onHandleDeleteRequest = async (id) => {
      try{
        const response  = await api.delete('/admin/request/delete/' + id, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        if(response.data.success === true){
          this.fetchRequetsData();
          NotificationManager.success('Delete request success.','', 2000);
        } else {
          throw new Error();
        }
      } catch {
        console.log(Error);
      }
    }

    render() {
        return (
          <>
          <NavBar
            onHandleUsers = {this.onHandleUsers}
            onHandleTypeShip = {this.onHandleTypeShip}
            onHandleLogout = {this.onHandleLogout}
          />
          <NotificationContainer/>
            <div className="container">
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-5">
                    <h2>Requests <b>Management</b></h2>
                  </div>
                </div>
              </div>
              <table
                className="table table-striped table-hover">
                <thead key="thead">
                  <tr>
                    <th>#</th>
                    <th>Receiver</th>
                    <th>Distance</th>				
                    <th>Shipper</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody key="tbody">
                {(this.state.arrRequests || []).map((request, index) => (
                    <>
                    <tr>
                        <td key="1">{index + 1}</td>
                        <td key="2">{request.receiver}</td>
                        <td key="3">{request.length} km</td>
                        <td key="4">{request.shipperName}</td>
                        <td key="5">{request.cost}</td>
                        <td key="6">
                          <span className={ request.status === 1 ? "status text-secondary" :
                            ( request.status === 2 ? "status text-warning" :
                            ( request.status === 3 ? "status text-primary" : 
                            ( request.status === 5 ? "status text-secondary" : "status text-success"))) }>•</span>
                            <a>{ request.status === 1 ? "Sent" :
                            ( request.status === 2 ? "Shipper Accepted" :
                            ( request.status === 3 ? "Shipper Completed" :
                            ( request.status === 5 ? "Canceled" : "Verified"))) }</a>
                        </td>
                        <td key="7">
                            <a
                              onClick={ () => this.onOpenModal(request,index) }
                              className="settings cursor-pointer"
                              title="View"
                              ><i className="fa fa-pencil-square-o" />
                            </a>
                            <a
                              className="delete cursor-pointer"
                              title="Delete"
                              data-toggle="tooltip"
                              onClick={ () => this.onHandleDeleteRequest(request.id) }
                          ><i className="material-icons"></i></a>
                        </td>
                      </tr>
                  </>
                ))}
                </tbody>
              </table>
              <div
                className={`modal fade ${this.state.modalOpened ? 'show' : ''}`}
                style={{ display: this.state.modalOpened ? 'block' : 'none' }}
              >
              <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{this.state.index}.Type Ship {this.state.request?.id} </h5>
                    <button type="button" className="close" onClick={this.onCloseModal}>
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p className="col-lg control-label"><strong>Type Ship Name: </strong>{this.state.request?.typeShipName}</p>
                    <p className="col-lg control-label"><strong>Shipper's Name: </strong>{this.state.request?.shipperName}</p>
                    <p className="col-lg control-label"><strong>Customer's Name: </strong>{this.state.request?.customerName}</p>
                    <p className="col-lg control-label"><strong>Receiver: </strong>{this.state.request?.receiver}</p>
                    <p className="col-lg control-label"><strong>Receiver Phone Number: </strong>{this.state.request?.phoneReceiver}</p>
                    <p className="col-lg control-label"><strong>Start place: </strong>{this.state.request?.start}</p>
                    <p className="col-lg control-label"><strong>Destination: </strong>{this.state.request?.destination}</p>
                    <p className="col-lg control-label"><strong>Distance: </strong>{this.state.request?.length} km</p>
                    <p className="col-lg control-label"><strong>Note request : </strong>{this.state.request?.note}</p>
                    <p className="col-lg control-label"><strong>Cost: </strong>{this.state.request?.cost} VND</p>
                    <p className="col-lg control-label"><strong>Time of request creation: </strong>{new Date(this.state.request?.created_at).toLocaleString()}</p>
                    <p className="col-lg control-label"><strong>Time of shipper start: </strong>{new Date(this.state.request?.startAt).toLocaleString()}</p>
                    {!!this.state.request?.endAt === true ?
                    <p className="col-lg control-label"><strong>Time of complete: </strong>{new Date(this.state.request?.endAt).toLocaleString()}</p> : 
                    <p className="col-lg control-label"><strong>Time of complete: </strong>Uncomplete</p> }
                    <p className="col-lg control-label"><strong>Last time of updated: </strong>{new Date(this.state.request?.updated_at).toLocaleString()}</p>
                    <p className="col-lg control-label"><strong>Star Rate: </strong>{!!this.state.request?.starsCount === true ? <Star starsCount={this.state.request?.starsCount} /> : "No voted yet" }</p>
                    <p className="col-lg control-label"><strong>Comment: </strong>{this.state.request?.comment}</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={ this.onCloseModal } >Close</button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
          </>
        );
    }
}

export default adminRequests;