import React, { Component } from 'react';
import { isUserLoggedIn, getUserData, VT_BASE, Logout } from '../Helper';
import axios from 'axios';
import 'react-notifications/lib/notifications.css';
import { Link, Switch, Route } from "react-router-dom";
import { NotificationContainer } from 'react-notifications';
import Chart from 'chart.js';

import Loading from './widgets/Loading';
import BuyShare from './widgets/BuyShare';
import SellShare from './widgets/SellShare';
class Company extends Component {
    state = {
        data: null,
        isSell: false,
        portfolio: null
    }
    componentDidMount() {
        this.getCompanyDetails();
        this.loadPortfolio();
            axios({
                method: 'GET',
                url: "http://127.0.0.1:5000/"+this.props.match.params.company,
            })
                .then((response) => {
                     var raw_data = response?.data?.forecasted_stocks;
                    var data_new = [];
                    var today = new Date();
                    for (var i = 0; i < raw_data?.length; i++) {
                        data_new.push({ 'y': raw_data[i], 'x': new Date(today.getTime() + (24 * 60 * 60 * 1000* (i+1))).toDateString() })
                    }
                    var config = {
                        type: 'line',
                        data: {
                            labels: [1,2,3,4,5,6,7].map((item)=> new Date(today.getTime() + (24 * 60 * 60 * 1000* item)).toDateString().split(' ').slice(1).join(' ')),
                            datasets: [{
                                label: 'Predicted Stock Price',
                                data: raw_data,
                                backgroundColor: [
                                    'rgba(69, 170, 242,0.2)',
                                ],
                                borderColor: [
                                    'rgba(69, 170, 242,1.0)',
                                ],
                                pointBackgroundColor: 'rgba(69, 170, 242,1.0)',
                                borderWidth: 3,
                                pointRadius: 5,
                                fill: 'start',
                                lineTension: 0,
                            }]
                        },
                        options: {
                            scales: {
                                xAxes: [{
                                    ticks:{
                                        fontColor:"#aaa"
                                    }
                                }],
                                yAxes: [{
                                    ticks:{
                                        fontColor:"#aaa"
                                    }
                                }]
                            },
                            parsing: {
                                xAxisKey: 'x',
                                yAxisKey: 'y'
                            },
                            legend: {
                                labels: {
                                    fontColor: "#fff",
                                    fontSize: 16
                                }
                            },
                        }
                    };
                    var ctx = document.getElementById('forcastChart').getContext('2d');
                    window.myChart = new Chart(ctx, config);
                })
                .catch((error) => {
                    console.log(error.response);
                })
            

    }
    handleBuySwitch = e => {
        this.setState({ isSell: e.target.checked })
    }
    getCompanyDetails = () =>{
        axios({
            method: 'GET',
            url: VT_BASE + "/scrape-data/company-details/" + this.props.match.params.company,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("vt-token")
            }
        })
            .then((response) => {
                this.setState({data: response.data});
                this.loadCompanyGraph(response.data.companyNo);
            })
            .catch((error) => {
                console.log(error.response);
            })
    }
    loadPortfolio = () =>{
        const user  = getUserData();
        axios({
            method: 'GET',
            url: VT_BASE + "/portfolio/"+ user.userid,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("vt-token")
            }
        })
            .then((response) => {
                console.log(response);
                if(response.data.length>0){
                    this.setState({portfolio: response.data[0]})
                }
            })
            .catch((error) => {
                console.log(error.response);
            })
    }
    loadCompanyGraph= (id) =>{
        axios({
            method: 'GET',
            url: VT_BASE + "/scrape-data/chart/market/company/"+id+"/D/",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("vt-token")
            }
        })
            .then((response) => {
                var raw_data = response.data;
                var data_new = []
                for (var i = 0; i < raw_data?.data.length; i++) {
                    data_new.push({ 'y': raw_data?.data[i], 'x': raw_data?.time[i] })
                }
                var config = {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Stock Price',
                            data: data_new,
                            backgroundColor: [
                                'rgba(15, 185, 177,0.2)',
                            ],
                            borderColor: [
                                "rgba(15, 185, 177,1.0)"
                            ],
                            pointBackgroundColor: 'rgba(15, 185, 177,1.0)',
                            pointRadius: 0,
                            borderWidth: 3,
                            fill: 'start',
                            lineTension: 0,
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                type: 'time',
                                ticks:{
                                    fontColor:"#aaa"
                                }
                            }],
                            yAxes: [{
                                ticks:{
                                    fontColor:"#aaa"
                                }
                            }]
                        },
                        legend: {
                            labels: {
                                fontColor: "#fff",
                                fontSize: 16
                            }
                        },
                    }
                };
                var ctx = document.getElementById('companyChart').getContext('2d');
                window.myChart = new Chart(ctx, config);
            })
            .catch((error) => {
                console.log(error.response);
            })
    }
    render() {
        const { data, isSell, portfolio } = this.state;
        return (
            <>
                <NotificationContainer />
                <div className="content-page">
                    <div className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div className="page-title-box">
                                        <div className="page-title-right">
                                            <ol className="breadcrumb m-0">
                                                <li className="breadcrumb-item"><a href="/dashboard">Dashboard</a></li>
                                                <li className="breadcrumb-item">Company</li>
                                                <li className="breadcrumb-item active">{this.props.match.params.company}</li>
                                            </ol>
                                        </div>
                                        <h4 className="page-title">Company Details
                                        {data===null?"":" - "+data?.companyName}
                                        </h4>
                                    </div>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-xl-3">
                                    <div className="card-box">
                                        <h4 className="mt-0 font-16 mb-3">Details</h4>
                                        {data === null ? <Loading /> :
                                            <>
                                                <div>
                                                    <h5>Change</h5>
                                                    <p>{data?.percentChange}</p>
                                                </div>
                                                <div>
                                                    <h5>LTP</h5>
                                                    <p>{data?.marketPrice}</p>
                                                </div>
                                                <div>
                                                    <h5>1 Year Yield</h5>
                                                    <p>{data?.oneYearYield}</p>
                                                </div>
                                                <div>
                                                    <h5>Total Listed Share</h5>
                                                    <p>{data?.listedShares}</p>
                                                </div>
                                                <div>
                                                    <h5>Total Paiup Value</h5>
                                                    <p>{data?.totalPaidupvalue}</p>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <div className="card-box">
                                        <h4 className="mt-0 font-16 mb-3">Stock Data - D</h4>
                                        <canvas id="companyChart"></canvas>
                                    </div>
                                </div>
                                <div className="col-xl-3">
                                    <div className="card-box">
                                        <div className="float-right">
                                            <div className="custom-control custom-switch mb-2">
                                                <input type="checkbox" className="custom-control-input" id="customSwitch_buysell"
                                                    onChange={(e) => this.handleBuySwitch(e)}
                                                />
                                                <label className="custom-control-label" htmlFor="customSwitch_buysell">SELL</label>
                                            </div>
                                        </div>
                                        <h4 className="mt-0 font-16 mb-3">Actions</h4>
                                        {
                                            isSell === true ?
                                                <SellShare data={data} portfolio={portfolio}/> :
                                                <BuyShare data={data} portfolio={portfolio}/>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                            <div className="col-xl-6">
                                    <div className="card-box">
                                        <h4 className="mt-0 font-16 mb-3">Forcasted Data</h4>
                                        <canvas id="forcastChart"></canvas>
                                    </div>
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
            </>
        );
    }
}

export default Company;