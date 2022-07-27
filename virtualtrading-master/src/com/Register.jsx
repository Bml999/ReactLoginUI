import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import {VT_BASE} from './Helper';
import {NotificationContainer, NotificationManager} from "react-notifications";
class Register extends Component {
    state = {}
    handleRegister = (e) =>{
        //NotificationManager.error("Registration disabled");
        e.preventDefault();
        var formData = new FormData(e.target);
        var data = Object.fromEntries(formData);
        axios({
            method: 'post',
            url: VT_BASE + "/user/register",
            data: {
                logintype: "EMAIL",
                phone:"1234567890",
                roles: ["paiduser"],
                ...data
            },
          })
            .then((response) => {
                NotificationManager.success("Registration successfull.")
            })
            .catch((error) => {
                NotificationManager.error(error.response.data.message?? "Error occured");
            })
    }
    componentDidMount(){
    }
    render() {
        return (
            <div className="account-pages mt-5 mb-5">
                <NotificationContainer />
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="text-center w-75 m-auto">
                                        <h2>Virtual Trading </h2>
                                        <p className="text-muted mb-4 mt-3">Don't have an account? Create your free account now.</p>
                                    </div>
                                    <h5 className="auth-title">Create Account</h5>
                                    <form onSubmit={(e)=> this.handleRegister(e)}>
                                        <div className="form-group">
                                            <label htmlFor="first_name">First Name</label>
                                            <input className="form-control" type="text" id="firstName" placeholder="Enter first name" name="firstName"  required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="last_name">Last Name</label>
                                            <input className="form-control" type="text" id="lastName" placeholder="Enter last name" name="lastName"  required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="username">Username</label>
                                            <input className="form-control" type="text" id="username" placeholder="Enter username" name="username"  required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="emailaddress">Email address</label>
                                            <input className="form-control" type="email" id="emailaddress" required name="email" placeholder="Enter your email" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input className="form-control" type="password" required id="password" name="password" placeholder="Enter your password" />
                                        </div>
                                        <div className="form-group">
                                            <div className="custom-control custom-checkbox checkbox-info">
                                                <input type="checkbox" className="custom-control-input" id="checkbox-signup" />
                                                <label className="custom-control-label" htmlFor="checkbox-signup">I accept <a href="javascript: void(0);" className="text-dark">Terms and Conditions</a></label>
                                            </div>
                                        </div>
                                        <div className="form-group mb-0 text-center">
                                            <button className="btn btn-danger btn-block" type="submit"> Sign Up </button>
                                        </div>
                                    </form>
                                   
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12 text-center">
                                    <p className="text-muted">Already have account?  <Link to="/login" className="text-muted ml-1"><b className="font-weight-semibold">Sign In</b></Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}

export default Register;