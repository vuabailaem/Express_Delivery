import React, { useState} from "react";

const ModalRequestAcp = (props) => {
    return(
        <div
              className={`modal fade ${props.modalOpened ? 'show' : ''}`}
              style={{ display: props.modalOpened ? 'block' : 'none' }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content align-items-center justify-content-center">
                  <div className="modal-header">
                    <h5 className="modal-title"><strong>Your Request has been accepted</strong></h5>
                    <button type="button" className="close" onClick={props.onCloseModal}>
                      <span>&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <h6><strong>Shipper's Name: </strong>{props.dataShipper?.firstname} {props.dataShipper?.lastname}</h6>
                    <h6><strong>Shipper's PhoneNumber: </strong>{props.dataShipper?.phoneNumber}</h6>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={ props.onCloseModal } >Close</button>
                  </div>
                </div>
              </div>
            </div>
    );
};

export default ModalRequestAcp;