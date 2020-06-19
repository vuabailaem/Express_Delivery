import React, { useState} from "react";
import {withRouter} from 'react-router-dom'
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

const NavBar = (props) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const toggle = () => setPopoverOpen(!popoverOpen);
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand cursor-pointer" onClick={props.onHandleHome}>Express Delivery</a>
            <button className="navbar-toggler">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse">
                {props.location.pathname.split('/').slice(0,2).join('') === "admin" ?
                <>
                    <ul className="navbar-nav mr-auto">
                    <li className={props.location.pathname === "/admin/users" ? "nav-item active" : "nav-item"} >
                        <a className="nav-link cursor-pointer" onClick={props.onHandleUsers}>Users Management</a>
                    </li>
                    <li className={props.location.pathname === "/admin/typeShip" ? "nav-item active" : "nav-item"}>
                        <a className="nav-link cursor-pointer" onClick={props.onHandleTypeShip} >Type Ship Management</a>
                    </li>
                    <li className={props.location.pathname === "/admin/Requests" ? "nav-item active" : "nav-item"}>
                        <a className="nav-link cursor-pointer" onClick={props.onHandleRequests} >Request Management</a>
                    </li>
                    </ul>
                    <form className="form-inline my-2 my-lg-0">
                        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>
                </> : 
                (props.location.pathname.split('/').slice(0,2).join('') === "customer" ? 
                <>
                    <ul className="navbar-nav mr-auto">
                    <li className={props.location.pathname === "/customer/createRequest" ? "nav-item active" : "nav-item"}>
                        <a className="nav-link cursor-pointer" onClick={props.onHandleCreateRequest}>Create Request</a>
                    </li>
                    <li className={props.location.pathname === "/customer/request" ? "nav-item active" : "nav-item"}>
                        <a className="nav-link cursor-pointer" onClick={props.onHandleMyRequest} >My Request</a>
                    </li>
                    </ul>
                    <div>
                        <Button id="Popover1" type="button" className="mr-3">
                            <i className="fa fa-bell" />
                            <span className="badge badge-light">{props.arrNotify?.length}</span>
                        </Button>
                        <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
                        {(props.arrNotify || []).map((notify, index) => (
                            (notify.checked === 0
                                ? <PopoverBody className="cursor-pointer" onClick={props.onHandleCheckNoti}>Request has id={notify.id} has done.</PopoverBody>
                                : ''
                            )
                        ))}
                        </Popover>
                            {/* <PopoverHeader>Popover Title</PopoverHeader>
                            <PopoverBody>Conten1.</PopoverBody> */}
                    </div>
                </> : 
                <>
                    <ul className="navbar-nav mr-auto">
                    </ul>
                </>)}
                <button
                    onClick={ props.onHandleLogout }
                    className="btn btn-lg btn-outline-danger"
                ><i className="fa fa-sign-out"/> <span>Sign Out</span></button>
            </div>
        </nav>
    );
};

export default withRouter(NavBar);