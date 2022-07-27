import React, { Component } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { VT_BASE, getUserData } from '../Helper';
import { NotificationManager } from 'react-notifications';
class Profile extends Component {
    state = {
        profileLoading: false,
        passLoading: false,
        picLoading: false
    }
    render() {
        const {profileLoading, passLoading, picLoading} = this.state;
        return (
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                            <li className="breadcrumb-item active">Profile</li>
                                        </ol>
                                    </div>
                                    <h4 className="page-title">Profile</h4>
                                </div>
                            </div>
                        </div>


                        <div className="row">
                            <div className="col-xl-6">
                                <form onSubmit={(e) => this.handleUserProfile(e)}>
                                    <div className="card-box">
                                        <i className="fa fa-info-circle text-muted float-right" data-toggle="tooltip" data-placement="bottom" title data-original-title="More Info" />
                                        <h4 className="mt-0 font-16 mb-3">User Details</h4>

                                        <div className="row mb-4">
                                            <div className="col-6">
                                                <div className="form-group mb-3">
                                                    <label>First Name</label>
                                                    <input type="text" className="form-control" name="first_name" defaultValue={this.props.user.fullname} readOnly/>
                                                </div>
                                                <div className="form-group mb-3">
                                                    <label>Email</label>
                                                    <input type="email" className="form-control" defaultValue={this.props.user.useremail} readOnly />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </form>
                            </div>
                    </div>
                </div>
                </div>
                <footer className="footer">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-md-6">
                                                2020 © Virtual Trading
                                            </div>
                                        </div>
                                    </div>
                                </footer>
            </div>
        );
    }
}

export default Profile;