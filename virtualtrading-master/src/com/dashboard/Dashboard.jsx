import React, { Component } from 'react';
import { isUserLoggedIn, getUserData, VT_BASE, Logout } from '../Helper';
import axios from 'axios';
import 'react-notifications/lib/notifications.css';
import { Link, Switch, Route } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';
import Select from 'react-select';
import './../../App.css';

import Profile from './Profile';
import TodaysPrice from './widgets/TodaysPrice';
import Company from './Company';
import Loading from './widgets/Loading';
import Portfolio from './widgets/Portfolio';
import BuyingList from './widgets/BuyingList';
import SellingList from './widgets/SellingList';
import MarketSummary from './widgets/MarketSummary';
import SectorSummary from './widgets/SectorSummary';
import TopGainers from './widgets/TopGainers';
import TopLoosers from './widgets/TopLoosers';
import NEPSE from './widgets/NEPSE';

const companies = [
    {
        value: "NABIL",
        label:"Nabil Bank Limited"
    },
    {
        value: "MNBBL",
        label:"Muktinath Bikas Bank Ltd."
    },
    {
        value: "CIT",
        label:"Citizen Investment Trust"
    },
    {
        value: "EBL",
        label:"Everest Bank Limited"
    },
    {
        value: "NHPC",
        label:"National Hydro Power Company Limited"
    },
    {
        value: "NLIC",
        label:"Nepal Life Insurance Co. Ltd."
    },
    {
        value: "NLICL",
        label:"National Life Insurance Co. Ltd."
    },
    {
        value: "SICL",
        label:"Shikhar Insurance Co. Ltd"
    },
]
class Dashboard extends Component {
    constructor(props) {
        super(props);
        if (!isUserLoggedIn()) {
            window.location.href = "/login";
        }
    }
    state = {
        user: {},
        selectedOption: null,
        selectedCompany: null,
        loading: false,
        pathData : this.props.location.pathname.split("/"),
        credits: null,
        portfolio: {empty: true}
    }
    componentDidMount() {
        const data = getUserData();
        if (data){
            this.setState({user: data});
            window.metisMenu();
            this.getUserPortfolio(data.userid);
        }
        axios({
            method: 'GET',
            url: VT_BASE + "/scrape-data/get-all-companies",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("auth-token")
            }
        })
            .then((response) => {
                var comps = []
                if (response.data !== null) {
                    response.data.map(item =>
                        comps.push({ value: item.symbol, label: item.name })
                    )
                    this.setState({ companies: comps });
                }
            })
            .catch((error) => {
                //console.log(error.response);
            })
    }
    getUserPortfolio = (userid) =>{
        axios({
            method: 'GET',
            url: VT_BASE + "/portfolio/"+userid,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("vt-token")
            }
        })
            .then((response) => {
                if(response.data.length>0){
                    this.setState({portfolio: response.data[0]})
                }
            })
            .catch((error) => {
                console.log(error.response);
            })
    }
    handleCompanyChange = (selectedOption) => {
        this.setState({ selectedOption });
        this.setState({ loading: true })
        axios({
            method: 'GET',
            url: VT_BASE + "/scrape-data/company-details/" + selectedOption.value,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("vt-token")
            }
        })
            .then((response) => {
                this.setState({ loading: false })
                if (response.data !== null) {
                    this.setState({ selectedCompany: response.data })
                }
            })
            .catch((error) => {
                this.setState({ loading: false })
                console.log(error.response);
            })
    }
    componentDidUpdate(prevProps){
        if(this.props.location != prevProps.location){
            this.setState({pathData: this.props.location.pathname.split("/")})
        }
    }
    render() {
        const { user, selectedCompany, selectedOption, loading, pathData, credits, portfolio } = this.state;
        if (user?.useremail !== undefined) {
            return (
                <>
                    <NotificationContainer />
                    <div>
                        <div id="wrapper">
                            <div className="navbar-custom">
                                <ul className="list-unstyled topnav-menu float-right mb-0">
                                    <li className="d-none d-sm-block">
                                        <form className="app-search">
                                            <div className="app-search-box">
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Search..." />
                                                    <div className="input-group-append">
                                                        <button className="btn" type="submit">
                                                            <i className="fe-search" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </li>
                                    <li className="dropdown notification-list">
                                        <a className="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                                            <img src="https://via.placeholder.com/150" alt="user-image" className="rounded-circle" />
                                            <span className="pro-user-name ml-1">
                                                {user.username} <i className="mdi mdi-chevron-down" />
                                            </span>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                                            {/* item*/}
                                            <div className="dropdown-item noti-title">
                                                <h5 className="m-0 text-white">
                                                    Welcome !
                                                </h5>
                                            </div>
                                            <Link to="/dashboard/profile/" className="dropdown-item notify-item">
                                                <i className="fe-user" />
                                                <span>Profile</span>
                                            </Link>
                                            <div className="dropdown-divider" />
                                            <a className="dropdown-item notify-item" onClick={() => Logout()}>
                                                <i className="fe-log-out" />
                                                <span>Logout</span>
                                            </a>
                                        </div>
                                    </li>
                                    {/* <li className="dropdown notification-list">
                                        <a href="javascript:void(0);" className="nav-link right-bar-toggle waves-effect waves-light">
                                            <i className="fe-settings noti-icon" />
                                        </a>
                                    </li> */}
                                </ul>
                                {/* LOGO */}
                                <div className="logo-box">
                                    <a href="/dashboard" className="logo text-center">
                                        <span className="logo-lg">
                                            {/* <img src="assets/images/logo-light.png" alt height={24} /> */}
                                            <span className="logo-lg-text-light">Virtual Trading</span>
                                        </span>
                                        <span className="logo-sm">
                                            <span className="logo-sm-text-dark">VT</span>
                                            {/* <img src="assets/images/logo-sm.png" alt height={28} /> */}
                                        </span>
                                    </a>
                                </div>
                                <ul className="list-unstyled topnav-menu topnav-menu-left m-0">
                                    <li>
                                        <button className="button-menu-mobile waves-effect waves-light">
                                            <span />
                                            <span />
                                            <span />
                                        </button>
                                    </li>
                                    <li>
                                        <h3 className="my-2 pt-2">Virtual Trading</h3>
                                    </li>
                                    </ul>
                            </div>
                            {/* end Topbar */}
                            {/* ========== Left Sidebar Start ========== */}
                            <div className="left-side-menu">
                                <div className="slimscroll-menu">
                                    {/*- Sidemenu */}
                                    <div id="sidebar-menu">
                                        <ul className="metismenu" id="side-menu" ref={this.sideMenu}>
                                            <li className="menu-title">Navigation</li>
                                            <li>
                                                <Link to="/dashboard">
                                                    <i className="la la-dashboard" />
                                                    <span> Dashboard </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/dashboard/portfolio">
                                                    <i className="la la-diamond" />
                                                    <span> Portfolio </span>
                                                </Link>
                                            </li>
                                           
                                            <li className="menu-title mt-2">Account</li>
                                            <li>
                                                <Link to="/dashboard/profile/">
                                                    <i className="la la-briefcase" />
                                                    <span> User Profile </span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* End Sidebar */}
                                    <div className="clearfix" />
                                </div>
                                {/* Sidebar -left */}
                            </div>
                            {/* Left Sidebar End */}


                            <Switch>
                                <Route path="/dashboard/profile" exact={true}
                                    render={() => <Profile user={this.state.user} />}
                                />
                                <Route path="/dashboard/company/:company" component={Company} />
                                <Route path="/dashboard/portfolio" component={Portfolio} />
                                <Route path="/dashboard/transactions/buy" component={BuyingList} />
                                <Route path="/dashboard/transactions/sell" component={SellingList} />
                            </Switch>
                            {/* ============================================================== */}
                            {/* Start Page Content here */}
                            {/* ============================================================== */}
                            {pathData.length===2?
                            <div className="content-page">
                                <div className="content">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="page-title-box">
                                                    <div className="page-title-right">
                                                        <ol className="breadcrumb m-0">
                                                            <li className="breadcrumb-item active">Dashboard</li>
                                                        </ol>
                                                    </div>
                                                    <h4 className="page-title">Dashboard</h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-xl-3">
                                                <div className="card-box">
                                                    <h4 className="mt-0 font-16">Total Investment</h4>
                                                    <h2 className="text-primary my-4 text-center">Rs <span data-plugin="counterup">
                                                        {portfolio.hasOwnProperty("empty")? "N/A": portfolio.totalInvestment}
                                                        </span></h2>
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <p className="text-muted mb-1">Overall Profit</p>
                                                            <h3 className="mt-0 font-20 text-truncate">
                                                            Rs {portfolio.hasOwnProperty("empty")? "N/A": portfolio.overallProfit}
                                                            </h3>
                                                        </div>
                                                        <div className="col-6">
                                                            <p className="text-muted mb-1">Current Value</p>
                                                            <h3 className="mt-0 font-20 text-truncate"> 
                                                            Rs {portfolio.hasOwnProperty("empty")? "N/A": portfolio.currentValue}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-xl-6">
                                                <div className="card-box" dir="ltr">
                                                    <h4 className="header-title mb-1">Companies</h4>
                                                    <div className="select-grid-cont my-3">
                                                        <div>
                                                            <Select options={companies} value={this.state.selectedOption}
                                                                onChange={this.handleCompanyChange}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Link to={selectedOption === null ? "#" : "/dashboard/company/" + selectedOption.value}>
                                                                <button className="btn btn-primary mx-2"
                                                                >Select</button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    {loading ? <Loading /> :
                                                        selectedCompany === null ? "" :
                                                            <div className="select-data-grid">
                                                                <div className="card">
                                                                    <h5>Change Percent</h5>
                                                                    <p>{selectedCompany?.percentChange}</p>
                                                                </div>


                                                                <div className="card">
                                                                    <h5>LTP</h5>
                                                                    <p>{selectedCompany?.marketPrice}</p>
                                                                </div>



                                                                <div className="card">
                                                                    <h5>1 Year Yield</h5>
                                                                    <p>{selectedCompany?.oneYearYield}</p>
                                                                </div>

                                                            </div>
                                                    }
                                                </div> {/* end card-box*/}
                                            </div> {/* end col */}
                                            <div className="col-xl-3">
                                                <NEPSE />
                                            </div>
                                            <div className="col-xl-3" hidden>
                                                <div className="card-box">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="avatar-sm bg-light rounded">
                                                                <i className="fe-shopping-cart avatar-title font-22 text-success" />
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="text-right">
                                                                <h3 className="text-dark my-1"><span data-plugin="counterup">1576</span></h3>
                                                                <p className="text-muted mb-1 text-truncate">January's Sales</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <h6 className="text-uppercase">Target <span className="float-right">49%</span></h6>
                                                        <div className="progress progress-sm m-0">
                                                            <div className="progress-bar bg-success" role="progressbar" aria-valuenow={49} aria-valuemin={0} aria-valuemax={100} style={{ width: '49%' }}>
                                                                <span className="sr-only">49% Complete</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> {/* end card-box*/}
                                                <div className="card-box">
                                                    <div className="row">
                                                        <div className="col-6">
                                                            <div className="avatar-sm bg-light rounded">
                                                                <i className="fe-aperture avatar-title font-22 text-purple" />
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="text-right">
                                                                <h3 className="text-dark my-1">$<span data-plugin="counterup">12,145</span></h3>
                                                                <p className="text-muted mb-1 text-truncate">Income status</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <h6 className="text-uppercase">Target <span className="float-right">60%</span></h6>
                                                        <div className="progress progress-sm m-0">
                                                            <div className="progress-bar bg-purple" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} style={{ width: '60%' }}>
                                                                <span className="sr-only">60% Complete</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> {/* end card-box*/}
                                            </div>
                                        </div>
                                   
                                <div className="row">
                                    <div className="col-xl-6">
                                        <TopGainers />
                                    </div>
                                    <div className="col-xl-6">
                                        <TopLoosers />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-4">
                                        <MarketSummary />
                                    </div>
                                    <div className="col-xl-8">
                                        <TodaysPrice />
                                    </div>
                                </div>
                                   </div>
                                </div>
                                <footer className="footer">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <div className="col-md-6">
                                                2022 © Virtual Trading
                                            </div>
                                        </div>
                                    </div>
                                </footer>
                                {/* end Footer */}
                            </div>
                            :""}
                            {/* ============================================================== */}
                            {/* End Page content */}
                            {/* ============================================================== */}
                        </div>
                        {/* END wrapper */}
                        {/* Right Sidebar */}
                        <div className="right-bar">
                            <div className="rightbar-title">
                                <a href="javascript:void(0);" className="right-bar-toggle float-right">
                                    <i className="mdi mdi-close" />
                                </a>
                                <h5 className="m-0 text-white">Settings</h5>
                            </div>
                            <div className="slimscroll-menu">
                                {/* User box */}
                                <div className="user-box">
                                    <div className="user-img">
                                        <img src="https://via.placeholder.com/150" alt="user-img" title={user.fullname} className="rounded-circle img-fluid" />
                                        <a href="javascript:void(0);" className="user-edit"><i className="mdi mdi-pencil" /></a>
                                    </div>
                                    <h5>{user.fullname}</h5>

                                </div>
                                {/* Settings */}
                                <hr className="mt-0" />
                                <div className="row">
                                    <div className="col-6 text-center">
                                        <h4 className="mb-1 mt-0">Rs 8,504</h4>
                                        <p className="m-0">Balance</p>
                                    </div>
                                    <div className="col-6 text-center">
                                        <h4 className="mb-1 mt-0">8,504</h4>
                                        <p className="m-0">Balance</p>
                                    </div>
                                </div>
                                <hr className="mb-0" />
                                <div className="p-3">
                                    <div className="custom-control custom-switch mb-2">
                                        <input type="checkbox" className="custom-control-input" id="customSwitch1" defaultChecked />
                                        <label className="custom-control-label" htmlFor="customSwitch1">Notifications</label>
                                    </div>
                                    <div className="custom-control custom-switch mb-2">
                                        <input type="checkbox" className="custom-control-input" id="customSwitch2" />
                                        <label className="custom-control-label" htmlFor="customSwitch2">API Access</label>
                                    </div>
                                    <div className="custom-control custom-switch mb-2">
                                        <input type="checkbox" className="custom-control-input" id="customSwitch3" defaultChecked />
                                        <label className="custom-control-label" htmlFor="customSwitch3">Auto Updates</label>
                                    </div>
                                    <div className="custom-control custom-switch mb-2">
                                        <input type="checkbox" className="custom-control-input" id="customSwitch4" defaultChecked />
                                        <label className="custom-control-label" htmlFor="customSwitch4">Online Status</label>
                                    </div>
                                </div>
                                {/* Timeline */}
                                <hr className="mt-0" />
                                <h5 className="pl-3 pr-3">Messages <span className="float-right badge badge-pill badge-danger">25</span></h5>
                                <hr className="mb-0" />
                                <div className="p-3">
                                    <div className="inbox-widget">
                                        <div className="inbox-item">
                                            <div className="inbox-item-img"><img src="assets/images/users/user-2.jpg" className="rounded-circle" alt /></div>
                                            <p className="inbox-item-author"><a href="javascript: void(0);" className="text-dark">Tomaslau</a></p>
                                            <p className="inbox-item-text">I've finished it! See you so...</p>
                                        </div>
                                        <div className="inbox-item">
                                            <div className="inbox-item-img"><img src="assets/images/users/user-3.jpg" className="rounded-circle" alt /></div>
                                            <p className="inbox-item-author"><a href="javascript: void(0);" className="text-dark">Stillnotdavid</a></p>
                                            <p className="inbox-item-text">This theme is awesome!</p>
                                        </div>
                                        <div className="inbox-item">
                                            <div className="inbox-item-img"><img src="assets/images/users/user-4.jpg" className="rounded-circle" alt /></div>
                                            <p className="inbox-item-author"><a href="javascript: void(0);" className="text-dark">Kurafire</a></p>
                                            <p className="inbox-item-text">Nice to meet you</p>
                                        </div>
                                        <div className="inbox-item">
                                            <div className="inbox-item-img"><img src="assets/images/users/user-5.jpg" className="rounded-circle" alt /></div>
                                            <p className="inbox-item-author"><a href="javascript: void(0);" className="text-dark">Shahedk</a></p>
                                            <p className="inbox-item-text">Hey! there I'm available...</p>
                                        </div>
                                        <div className="inbox-item">
                                            <div className="inbox-item-img"><img src="assets/images/users/user-6.jpg" className="rounded-circle" alt /></div>
                                            <p className="inbox-item-author"><a href="javascript: void(0);" className="text-dark">Adhamdannaway</a></p>
                                            <p className="inbox-item-text">This theme is awesome!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rightbar-overlay" />
                    </div>

                </>
            );
        } else {
            return (<Loading />);
        }
    }
}

export default Dashboard;
