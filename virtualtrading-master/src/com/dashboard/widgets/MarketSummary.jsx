import React, { Component } from 'react';
import axios from 'axios';
import { VT_BASE, getUserData } from '../../Helper';
import Loading from './Loading';
class MarketSummary extends Component {
    state = {
        data: null
    }
    componentDidMount() {
        axios({
            method: 'GET',
            url: VT_BASE + "/scrape-data/market-summary",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("vt-token")
            }
        })
            .then((response) => {
                this.setState({ data: response.data })
            })
            .catch((error) => {
                console.log(error.response);
            })
    }
    render() {
        const { data } = this.state;
            return (
                        <div className="card-box">
                            <div className="card-widgets">
                                <a href="javascript: void(0);" data-toggle="reload"><i className="mdi mdi-refresh" /></a>
                                <a data-toggle="collapse" href="#marketSummary" role="button" aria-expanded="false" aria-controls="todaysprice"><i className="mdi mdi-minus" /></a>
                                <a href="javascript: void(0);" data-toggle="remove"><i className="mdi mdi-close" /></a>
                            </div>
                            <h4 className="header-title mb-3">Market Summary</h4>
                            {data === null ? <Loading/>:
                            <div className="table-responsive" id="marketSummary">
                                <table className="table table-borderless table-hover table-centered  table-nowrap m-0">
                                    <tbody>
                                        <tr>
                                            <th>Total Turnover</th>
                                            <td>Rs {data.totalTurnover??""}</td>
                                        </tr>
                                        <tr>
                                            <th>Total Traded Shares</th>
                                            <td>{data.totalTradedShare??""}</td>
                                        </tr>
                                        <tr>
                                            <th>Total Transactions</th>
                                            <td>{data.totalTranscations ??""}</td>
                                        </tr>
                                        <tr>
                                            <th>Total Scripts Traded</th>
                                            <td>{data.totalScriptTraded ?? ""}</td>
                                        </tr>
                                        <tr>
                                            <th>Total Market Capitalization </th>
                                            <td>{data.totalMarketCapitalization ??""}</td>
                                        </tr>
                                        <tr>
                                            <th>Floated Market Capitalization</th>
                                            <td>{data.floatedMarketCapitalization??""}</td>
                                        </tr>
                                        
                                    </tbody>
                                </table>
                            </div>
    }
                        </div>
            )
    }
}

export default MarketSummary;