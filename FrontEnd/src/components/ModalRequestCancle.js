import React, { useState} from "react";
import {withRouter} from 'react-router-dom'

const ModalRequestCancle = (props) => {
    return(
        <div
              className={`modal fade ${props.modalOpened ? 'show' : ''}`}
              style={{ display: props.modalOpened ? 'block' : 'none' }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content align-items-center justify-content-center">
                  <div className="modal-header">
                    <h5 className="modal-title"><strong className="text-danger">Your Request has been canceled.</strong></h5>
                    <button type="button" className="close" onClick={props.onCloseModal}>
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    {props.location?.pathname.split('/').slice(0,2).join('') === "customer" ?
                      <><h6><strong>Shipper's Name: </strong>{props.dataShipper?.firstname} {props.dataShipper?.lastname}</h6></> :
                      <><h6><strong>Customer's Name: </strong>{props.customer?.customerName}</h6></>}
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={ props.onCloseModal } >Close</button>
                  </div>
                </div>
              </div>
            </div>
    );
};

export default ModalRequestCancle;