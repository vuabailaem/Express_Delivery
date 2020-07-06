import React, { Component } from 'react';
import api from '../api';
import StarRating from "../components/StarRating";
import Star from "../components/Star";
import NavBar from "../components/NavBar";
import {NotificationContainer, NotificationManager} from 'react-notifications';

class customerRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
          arrRequest: null,
          arrNotify: null,
          modalOpened: false,
          request:null,
          index: 0,
          requestId: 0,
          rating:null,
          comment:"",
        }
    }

    setRating = (rating) => {
      this.setState({rating:rating})
    }

    fetchCustomerRequestData = async () => {
      try {
          const response = await api.get('/customer/getMyRequests', {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          });

          if (response.data) {
              this.setState({ arrRequest: response.data.data });
          } else {
              throw new Error();
          }
      } catch {
          console.log(Error);
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

    componentDidMount() {
      this.fetchCustomerRequestData();
      this.fetchNotification();
      setTimeout(() => {
        // console.clear();
        // console.log(this.state.arrRequest);
      },500)
    }

    onHandleChange = (event) => {
      const target = event.target;
      const name = target.name;
      const value = target.value;
      this.setState({
         [name]: value,
      });
    }

    onOpenModal = (request,index) => {
      this.setState({modalOpened: true, request: {...request}, index: index + 1, requestId: request.id});
    }

    onCloseModal = () => {
      this.setState({modalOpened: false});
    }

    onHandleHome = () => {
      this.props.history.push('/login');
    }

    onHandleLogout = () => {
      localStorage.removeItem('token');
      this.props.history.push('/login');
    }

    onHandleCreateRequest = () => {
      this.props.history.push('/customer/createRequest');
    }

    onHandleSubmit = async (requestId,starsCount,comment) => {
      try{
        const response = await api.put('/customer/confirmRequest', {requestId, starsCount, comment},{
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        if(response.data.success === true){
          this.setState({modalOpened:false});
          this.fetchCustomerRequestData();
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
            arrNotify={this.state.arrNotify}
            onHandleHome={this.onHandleHome}
            onHandleCreateRequest={this.onHandleCreateRequest}
            onHandleLogout={this.onHandleLogout}
          />
            <div className="container">
              <NotificationContainer/>
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-5">
                    <h2>My <b>Request</b></h2>
                  </div>
                  <div className="col-sm-7">
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
                    <th>View/Comment</th>
                  </tr>
                </thead>
                <tbody key="tbody">
                {(this.state.arrRequest || []).map((request, index) => (
                      <>
                        <tr>
                            <td key="1">{index + 1}</td>
                            <td key="2">{request.receiver}</td>
                            <td key="3">{request.length} km</td>
                            <td key="4">{request.firstname} {request.lastname}</td>
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
                            </td>
                          </tr>
                      </>
                  ))}
                </tbody>
              </table>
            </div>
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
                    <p className="col-lg control-label"><strong>Shipper's Name: </strong>{this.state.request?.firstname} {this.state.request?.lastname}</p>
                    <p className="col-lg control-label"><strong>Shipper Phone Number: </strong>{this.state.request?.phoneNumber}</p>
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
                    {this.state.request?.status === 3 ?
                    <>
                      <p className="col-lg control-label"><strong>Star Rate: </strong>
                      <StarRating setRating={this.setRating} rating={this.state.rating} />
                      </p>
                      <p className="col-lg control-label"><strong>Comment: </strong>
                      <textarea
                        className="form-control"
                        rows="2"
                        name="comment"
                        onChange = {this.onHandleChange}
                      ></textarea></p>
                    </> : (this.state.request?.status === 4 ?
                    <>
                      <p className="col-lg control-label"><strong>Star Rate: </strong>
                      {!!this.state.request?.starsCount === true
                      ? <Star starsCount={this.state.request?.starsCount} />
                      : "No voted yet" }</p>
                      <p className="col-lg control-label"><strong>Comment: </strong>{this.state.request?.comment}</p>
                    </> :
                    <p className="col-lg control-label"><strong>Pending shipper response</strong></p>)}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={ this.onCloseModal } >Close</button>
                    {this.state.request?.status === 3 ? <button className="btn btn-primary"
                      onClick={() => this.onHandleSubmit(this.state.requestId, this.state.rating, this.state.comment)}
                    >Submit</button> : '' }
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
        );
    }
}

export default customerRequest;