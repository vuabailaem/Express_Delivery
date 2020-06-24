import React, { Component } from 'react';
import api from '../api';
import NavBar from '../components/NavBar';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class main extends Component {
    constructor(props) {
      super(props);
      this.state = {
          users: null,
      }
    }
    fetchCustomerData = async () => {
        try {
            const response = await api.get('/admin/getAllCustomers', {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            if (response.data.data) {
                this.setState({ customers: response.data.data, isLoading: false });
            } else {
              throw new Error();
          }
        } catch {
            console.log('Error')
        }
    }

    fetchShipperData = async () => {
      try {
          const response = await api.get('/admin/getAllShippers', {
              headers: {
                  Authorization: localStorage.getItem('token'),
              },
          });
          if (response.data.data) {
              this.setState({ shippers: response.data.data, isLoading: false });
          } else {
            throw new Error();
        }
      } catch {
          console.log('Error')
      }
  }

    componentDidMount() {
        this.fetchCustomerData();
        this.fetchShipperData();
    }

    onHandleLogout = () => {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }

    onHanleAddUser = () => {
        this.props.history.push('/signup/customer');
    }

    // onHandleChange = (event) => {
    //   const target = event.target;
    //   const value = target.value;
    // }

    onHandleTypeShip = () => {
      this.props.history.push('/admin/typeShip');
    }

    onHandleRequests = () => {
      this.props.history.push('/admin/Requests');
    }

    onHandleDeleteShipper = async (id) => {
      try {
        const response = await api.delete('/admin/shipper/delete/' + id, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        if (response.data.success) {
          this.fetchShipperData();
          NotificationManager.success('Delete shipper success.');
        } else {
          throw new Error();
        }
      } catch {
          console.log('Error')
      }
    }

    onHandleDeleteCustomer = async (id) => {
      try {
        const response = await api.delete('/admin/customer/delete/' + id, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        if (response.data.success) {
          NotificationManager.success('Delete customer success.');
          this.fetchCustomerData();
        } else {
          throw new Error();
        }
      } catch {
          console.log('Error')
      }
    }

    onHandleEditShipper = (id) => {
      this.props.history.push('/admin/edit/shipper/' + id);
    }

    onHandleEditCustomer = (id) => {
      this.props.history.push('/admin/edit/customer/' + id);
    }

    onHandleActiveCustomer = async (id, active) => {
      try {
        const response = await api.put('/admin/active/customer/' + id, { active }, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        if (response.data.success) {
          this.fetchCustomerData();
        } else {
          throw new Error();
        }
      } catch {
          console.log('Error')
      }
    }
    onHandleActiveShipper = async (id, active) => {
      try {
        const response = await api.put('/admin/active/shipper/' + id, { active }, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        if (response.data.success) {
          this.fetchShipperData();
        } else {
          throw new Error();
        }
      } catch {
          console.log('Error')
      }
    }

    render() {
        return (
          <>
          <NavBar
            onHandleTypeShip = {this.onHandleTypeShip}
            onHandleRequests = {this.onHandleRequests}
            onHandleLogout = {this.onHandleLogout}
          />
          <NotificationContainer/>
            <div className="container">
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-5">
                    <h2>User <b>Management</b></h2>
                  </div>
                  <div className="col-sm-7">
                    <button
                    onClick = { this.onHanleAddUser }
                    className="btn btn-primary"
                    ><i className="material-icons"></i> <span>Add New User</span></button>
                  </div>
                </div>
              </div>
              <table
                className="table table-striped table-hover">
                <thead key="thead">
                  <tr>
                    <th>#</th>
                    <th>User Name</th>
                    <th>Name</th>				
                    <th>Phone Number</th>
                    <th>Role</th>
                    <th>Active</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody key="tbody">
                  {(this.state.shippers || []).map((shipper, index) => (
                      <>
                        <tr>
                            <td key="1">{ index + 1 }</td>
                            <td key="2">{ shipper.username }</td>
                            <td key="3">{ shipper.firstname } { shipper.lastname }</td>
                            <td key="4">{ shipper.phoneNumber }</td>
                            <td key="5">Shipper</td>
                            <td key="6">
                              <span className={ shipper.active === 1 ? "status text-success" : "status text-warning" }>•</span>
                              <a
                                className="cursor-pointer"
                                onClick={ () => this.onHandleActiveShipper(shipper.id, shipper.active === 1 ? 0 : 1) }
                              >{ shipper.active === 1 ? "Active" : "Suspended" }</a>
                            </td>
                            <td key="7">
                                <a
                                  onClick={ () => this.onHandleEditShipper(shipper.id) }
                                  className="settings cursor-pointer"
                                  title="Settings"
                                  data-toggle="tooltip"><i className="material-icons"></i>
                                </a>
                              <a
                                className="delete cursor-pointer"
                                title="Delete"
                                data-toggle="tooltip"
                                onClick={ () => this.onHandleDeleteShipper(shipper.id) }
                              ><i className="material-icons"></i></a>
                            </td>
                          </tr>
                      </>
                  ))}
                  {(this.state.customers || []).map((customer, index) => (
                      <>
                        <tr>
                            <td key="14">{ index + this.state.customers?.length + 1 }</td>
                            <td key="8">{ customer.username }</td>
                            <td key="9">{ customer.firstname } { customer.lastname }</td>
                            <td key="10">{ customer.phoneNumber }</td>
                            <td key="11">Customer</td>
                            <td key="12">
                              <span className={ customer.active === 1 ? "status text-success" : "status text-warning" }>•</span>
                              <a
                                className="cursor-pointer"
                                onClick={ () => this.onHandleActiveCustomer(customer.id, customer.active === 1 ? 0 : 1) }
                              >{ customer.active === 1 ? "Active" : "Suspended" }</a>
                            </td>
                            <td key="13">
                              <a
                                onClick={ () => this.onHandleEditCustomer(customer.id) }
                                className="settings cursor-pointer"
                                title="Settings"
                                data-toggle="tooltip"><i className="material-icons"></i>
                              </a>
                              <a
                                className="delete cursor-pointer"
                                title="Delete"
                                data-toggle="tooltip"
                                onClick={ () => this.onHandleDeleteCustomer(customer.id) }
                              ><i className="material-icons"></i></a>
                            </td>
                          </tr>
                      </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </>
        );
    }
}

export default main;