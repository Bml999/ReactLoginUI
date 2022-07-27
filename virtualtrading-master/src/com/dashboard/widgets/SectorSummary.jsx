import React, { Component } from 'react';
import axios from 'axios';
import { VT_BASE, getUserData } from '../../Helper';
import Loading from './Loading';
import Chart from 'chart.js';
class SectorSummary extends Component {
    state = {
        data: null
    }
    componentDidMount() {
        const data = getUserData();
        axios({
            method: 'GET',
            url: VT_BASE + "/todaysprice/sectorsummary/",
            headers: {
                'Authorization': 'Token ' + data.token
            }
        })
            .then((response) => {
                this.setState({ data: response.data.results })
                console.log(response.data);
                var d = response.data.results;
                var arr = []
                for (var x in d){
                    var temp = parseInt(d[x].replace(/,/g,""))
                    arr.push(temp)
                }
                var config = {
                    type: 'bar',
                    data: {
                        labels:['Commercial Banks','Corporate Debenture','Development Banks','Finance','Hotels',
                        'Hydro Power','Manufacturing & Processing','Non Life Insurance','Others','Tradings'],
                        datasets: [{
                            label:"Turnover Value",
                            data: arr,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.7)',
                                'rgba(41, 128, 185,0.7)',
                                'rgba(255, 206, 86, 0.7)',
                                'rgba(75, 192, 192, 0.7)',
                                'rgba(153, 102, 255, 0.7)',
                                'rgba(255, 159, 64, 0.7)',
                                'rgba(236, 240, 241,0.7)',
                                'rgba(192, 57, 43,0.7)',
                                'rgba(39, 174, 96, 0.7)',
                                'rgba(142, 68, 173,0.7)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(41, 128, 185,1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(236, 240, 241,1)',
                                'rgba(192, 57, 43,1)',
                                'rgba(39, 174, 96, 1)',
                                'rgba(142, 68, 173,1)'
                            ],
                            borderWidth: 1,
                        }]
                    },
                    options: {
                        legend: {
                            labels: {
                                fontColor: "#eee",
                                fontSize: 16
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    fontColor:"#eee",
                                    beginAtZero: true
                                }
                            }],
                            xAxes: [{
                                ticks: {
                                    fontColor:"#eee",
                                }
                            }]
                        },
                    }
                };
                var ctx = document.getElementById('sectorSummary').getContext('2d');
                window.myChart = new Chart(ctx, config);
            })
            .catch((error) => {
                console.log(error.response);
            })
    }
    render() {
        const { data } = this.state;
        if (data != null) {
            return (
                <>
                    <div className="card">
                        <div className="card-body">
                            <div className="card-widgets">
                                <a href="javascript: void(0);" data-toggle="reload"><i className="mdi mdi-refresh" /></a>
                                <a data-toggle="collapse" href="#sectorSummary" role="button" aria-expanded="false" aria-controls="todaysprice"><i className="mdi mdi-minus" /></a>
                                <a href="javascript: void(0);" data-toggle="remove"><i className="mdi mdi-close" /></a>
                            </div>
                            <h4 className="header-title mb-3">Sector Summary</h4>
                            {/* <div className="table-responsive" id="sectorSummary">
                                <table className="table table-borderless table-hover table-centered  table-nowrap m-0">
                                    <tbody>
                                        <tr>
                                            <th>Commercial Banks</th>
                                            <td>{data["Commercial Banks"]}</td>
                                        </tr>
                                        <tr>
                                            <th>Corporate Debenture</th>
                                            <td>{data["Corporate Debenture"]}</td>
                                        </tr>
                                        <tr>
                                            <th>Development Banks</th>
                                            <td>{data["Development Banks"]}</td>
                                        </tr>
                                        <tr>
                                            <th>Finance</th>
                                            <td>{data["Finance"]}</td>
                                        </tr>
                                        <tr>
                                            <th>Hotels</th>
                                            <td>{data["Hotels"]}</td>
                                        </tr>
                                        <tr>
                                            <th>Hydro Power</th>
                                            <td>{data["Hydro Power"]}</td>
                                        </tr>
                                        
                                    </tbody>
                                </table>
                            </div> */}
                            <canvas id="sectorSummary"></canvas>
                        </div>
                        </div>
                </>
            )
        }
        else {
            return <Loading />;
        }
    }
}

export default SectorSummary;