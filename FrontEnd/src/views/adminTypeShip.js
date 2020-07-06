import React, { Component } from 'react';
import api from '../api';
import NavBar from '../components/NavBar';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class adminTypeShip extends Component {
    constructor(props) {
      super(props);
      this.state = {
          types: null,
          isLoading: false,
          id: 0,
          name: "",
          price: "",
          modalOpened: false,
          isEditing: null
      }
    }

    fetchTypeShipData = async () => {
      try {
          const response = await api.get('/typeShip/getAll');
          if (response.data) {
              this.setState({ types: response.data, isLoading: false });
          } else {
            throw new Error();
        }
      } catch {
          console.log(Error);
      }
  }

    componentDidMount() {
        this.fetchTypeShipData();
    }

    onHandleLogout = () => {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }

    onHandleChange = (event) => {
      const target = event.target;
      const name = target.name;
      const value = target.value;
      this.setState({
        [name]: value,
      });
    }

    onHandleUsers = () => {
      this.props.history.push('/admin/users');
    }

    onHandleRequests = () => {
      this.props.history.push('/admin/Requests');
    }

    onHandleDeleteTypeShip = async (id) => {
      try {
        const response = await api.delete('/typeShip/delete/' + id);
        if (response.data.success) {
          this.fetchTypeShipData();
          NotificationManager.success('Delete type ship success.','', 2000);
        } else {
          throw new Error();
        }
      } catch {
          console.log('Error');
      }
    }

    onHandleActiveTypeShip = async (id, active) => {
      try {
        const response = await api.put('/typeShip/active/' + id, { active });
        if (response.data.success) {
          this.fetchTypeShipData();
        } else {
          throw new Error();
        }
      } catch {
          console.log(Error);
      }
    }

    onOpenModalAdd = () => {
      this.setState({ modalOpened: true, isEditing: 0, name:"", price:"" });
    }
    onOpenModalEdit = (id, name, price) => {
      this.setState({ modalOpened: true , id: id, name: name , price: price, isEditing: 1 });
    }

    onCloseModal = () => {
      this.setState({ modalOpened: false });
    }
    
    onHandleSubmitAdd = async (event) => {
      const name = this.state.name;
      const price = this.state.price;
      try {
        const response = await api.post('/typeShip/add', {name, price});
        if (response.data.success) {
          this.fetchTypeShipData();
          this.onCloseModal();
          NotificationManager.success('Add type success.','', 2000);
        } else {
          throw new Error();
        }
      } catch  {
        console.log(Error);
      }
    }

    onHandleSubmitEdit = async (event) => {
      const name = this.state.name;
      const price = this.state.price;
      const id = this.state.id
      try {
        const response = await api.put('/typeShip/edit/' + id, {name, price});
        if (response.data.success) {
          this.fetchTypeShipData();
          this.onCloseModal();
          NotificationManager.success('Update type success.','', 2000);
        } else {
          throw new Error();
        }
      } catch  {
        console.log(Error);
      }
    }

    render() {
        return (
          <>
          <NavBar
            onHandleUsers = {this.onHandleUsers}
            onHandleRequests = {this.onHandleRequests}
            onHandleLogout = {this.onHandleLogout}
          />
          <NotificationContainer/>
          <div className="container">
            <div className="table-wrapper">
              <div className="table-title">
                <div className="row">
                  <div className="col-sm-5">
                    <h2>Type Ship <b>Management</b></h2>
                  </div>
                  <div className="col-sm-7">
                    <button
                    onClick = { () => this.onOpenModalAdd() }
                    className="btn btn-primary"
                    ><i className="material-icons"></i> <span>Add New Type Ship</span></button>
                  </div>
                </div>
              </div>
              <table
                className="table table-striped table-hover">
                <thead key="thead">
                  <tr>
                    <th>#</th>
                    <th>Name's Type Ship</th>				
                    <th>Price</th>
                    <th>Active</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody key="tbody">
                  {(this.state.types || []).map((type, index) => (
                    <>
                    <tr key={index}>
                      <td>{ index + 1 }</td>
                      <td>{ type.name }</td>
                      <td>{ type.price }</td>
                      <td>
                        <span className={ type.active === 1 ? "status text-success" : "status text-warning" }>•</span>
                        <a
                          className="cursor-pointer"
                          onClick={ () => this.onHandleActiveTypeShip(type.id, type.active === 1 ? 0 : 1) }
                        >{ type.active === 1 ? "Active" : "Suspended" }</a>
                      </td>
                      <td>
                      <a
                        className="settings cursor-pointer"
                        title="Settings"
                        onClick= { () => this.onOpenModalEdit(type.id, type.name, type.price)}
                      ><i className="material-icons"></i>
                      </a>
                      <a
                        className="delete cursor-pointer"
                        title="Delete"
                        data-toggle="tooltip"
                        onClick={ () => this.onHandleDeleteTypeShip(type.id) }
                      ><i className="material-icons"></i></a>
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
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{ this.state.isEditing === 1 ? "Edit" : "Add" } Type Ship {this.state.name}</h5>
                    <button type="button" className="close" onClick={this.onCloseModal}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <h4 className="col-lg control-label">Type Ship's Name:</h4>
                    <input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={ this.onHandleChange }
                        value={ this.state.name } /><br />
                      <h4 className="col-lg control-label">Type Ship's Price:</h4>
                      <input
                        className="form-control"
                        type="text"
                        name="price"
                        onChange={ this.onHandleChange }
                        value={ this.state.price } />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={ this.onCloseModal } >Close</button>
                    <button type="button" className="btn btn-primary"
                      disabled={(!!this.state.name === false || !!this.state.price === false)? true: false}
                      onClick={ () => this.state.isEditing === 1
                        ? this.onHandleSubmitEdit(this.state.name, this.state.price)
                        : this.onHandleSubmitAdd(this.state.name, this.state.price) }
                    >Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
        );
    }
}

export default adminTypeShip;