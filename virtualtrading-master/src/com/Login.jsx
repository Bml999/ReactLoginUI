import React, { Component } from 'react';
import {Link} from "react-router-dom";
import axios from 'axios';
import {VT_BASE,authenticateUser} from './Helper';
class Login extends Component {
    state = {
        loading: false
    }
    handleLogin = (e) =>{
        e.preventDefault();
        var formData = new FormData(e.target);
        var data = JSON.stringify(Object.fromEntries(formData));
        this.setState({loading: true});

    axios({
      method: 'post',
      url: VT_BASE + "/user/auth/login",
      data: data,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
          this.setState({loading: false});
        if (response.data != null) {
          authenticateUser(response.data);
        }
      })
      .catch((error) => {
        this.setState({loading: false});
      })
    }
    render() {
        const {loading} = this.state;
        return (
            <div className="account-pages mt-5 mb-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6 col-xl-5">
                            <div className="card">
                                <div className="card-body p-4">
                                    <div className="text-center w-75 m-auto">
                                        <h2>Stock trading</h2>
                                        <p className="text-muted mb-4 mt-3">Enter your email address and password to access dashboard</p>
                                    </div>
                                    <h5 className="auth-title">SIGN IN</h5>
                                    <form onSubmit={(e)=> this.handleLogin(e)}>
                                        <div className="form-group">
                                            <label htmlFor="emailaddress">Username</label>
                                            <input className="form-control" type="text" id="emailaddress" required name="username" placeholder="Username" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input className="form-control" type="password" required id="password" name="password" placeholder="Enter your password" />
                                        </div>
                                        <div className="form-group">
                                            <div className="custom-control custom-checkbox checkbox-info">
                                                <input type="checkbox" className="custom-control-input" id="checkbox-signup" />
                                                <label className="custom-control-label" htmlFor="checkbox-signup"> remember me</label>
                                            </div>
                                        </div>
                                        <div className="form-group mb-0 text-center">
                                            <button className="btn btn-danger btn-block" type="submit" disabled={loading}>
                                                {loading?"Authenticating...":"Log In"}
                                            </button>
                                        </div>
                                    </form>
                                    <div className="text-center">
                                        <h5 className="mt-3 text-muted">Sign in using</h5>
                                        <ul className="social-list list-inline mt-3 mb-0">
                                            <li className="list-inline-item">
                                                <a href="#" className="social-list-item border-primary text-primary"><i className="mdi mdi-facebook" /></a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#" className="social-list-item border-danger text-danger"><i className="mdi mdi-google" /></a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#" className="social-list-item border-info text-info"><i className="mdi mdi-twitter" /></a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#" className="social-list-item border-secondary text-secondary"><i className="mdi mdi-github-circle" /></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-12 text-center">
                                    <p className="text-muted">Don't have an account?  <Link to="/register" className="text-muted ml-1"><b className="font-weight-semibold">Sign up</b></Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}

export default Login;