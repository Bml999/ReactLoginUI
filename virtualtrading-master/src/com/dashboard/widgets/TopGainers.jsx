import React, { Component } from 'react';
import axios from 'axios';
import { VT_BASE, getUserData } from '../../Helper';
import Loading from './Loading';
class TopGainers extends Component {
    state = {
        data: null
    }
    componentDidMount() {
        axios({
            method: 'GET',
            url: VT_BASE + "/scrape-data/get-top-gainers",
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
                            <h4 className="header-title mb-3">Top Gainers</h4>
                            {data === null ? <Loading/>:
                            <div className="table-responsive" id="marketSummary">
                                <table className="table table-borderless table-hover table-centered  table-nowrap m-0">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>SN</th>
                                            <th>Symbol</th>
                                            <th>LTP</th>
                                            <th>Percent Change</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.results.map((item, index)=>
                                            index<10?
                                            <tr key={item.symbol+index}>
                                                <td>{index+1}</td>
                                                <td>{item?.symbol??""}</td>
                                                <td>Rs {item?.ltp??""}</td>
                                                <td>{item?.percnetchange??""}</td>
                                            </tr>:null
                                        )}
                                    </tbody>
                                </table>
                            </div>
    }
                        </div>
            )
    }
}

export default TopGainers;