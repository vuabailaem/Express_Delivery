import React, { Component } from 'react';

class main extends Component {

    onHandleLogin = async () => {
        this.props.history.push('/login');
    }

    onHandleSignUp = () => {
        this.props.history.push('/signup/customer');
    }

    render() {
        return (
    <div className="align-center">
        <div className="fixCenter">
            <div className="">
                <div className="d-flex justify-content-center row">
                    <h1>Login</h1>
                </div>
                <div className="">
                    <div className="d-flex justify-content-center row mt-1">
                        <label className="lead">If you already have an account</label>
                    </div>
                    <div className="d-flex justify-content-center row mt-1">
                        <button
                        className="btn btn-primary w-100"
                        onClick={ this.onHandleLogin }
                        >Login</button>
                    </div>
                    <div className="d-flex justify-content-center row mt-1">
                        <label className="lead">If you haven't an account yet </label>
                    </div>
                    <div className="d-flex justify-content-center row mt-1">
                        <button
                        className="btn btn-primary w-100"
                        onClick={ this.onHandleSignUp }
                        >Sign Up</button>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
        );
    }
}

export default main;