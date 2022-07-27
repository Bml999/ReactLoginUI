import React, { Component } from 'react';
import axios from 'axios';
import { VT_BASE } from '../../Helper';
import Loading from './Loading';
class TodaysPrice extends Component {
    state = {
        data: null
    }
    componentDidMount() {
        axios({
            method: 'GET',
            url: VT_BASE + "/scrape-data/todaysprice",
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
        if (data !== null) {
            return (
                <>
                    <div className="card">
                        <div className="card-body">
                        <div className="card-widgets">
                            <a href="javascript: void(0);" data-toggle="reload"><i className="mdi mdi-refresh" /></a>
                            <a data-toggle="collapse" href="#todaysprice" role="button" aria-expanded="false" aria-controls="todaysprice"><i className="mdi mdi-minus" /></a>
                            <a href="javascript: void(0);" data-toggle="remove"><i className="mdi mdi-close" /></a>
                        </div>
                        <h4 className="header-title mb-3">Todays Price</h4>
                        <div className="table-responsive" id="todaysprice">
                            <table className="table table-borderless table-hover table-centered  table-nowrap m-0">
                                <thead className="thead-light">
                                    <tr>
                                        <th>S.N.</th>
                                        <th>Company</th>
                                        <th>Max Price</th>
                                        <th>Min Price</th>
                                        <th>Change</th>
                                        <th>LTP</th>
                                        <th>Prev. Close</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data?.results?.map((item, index) =>
                                            <tr key={index+item.symbol}>
                                                <td>{index+1}</td>
                                                <td>{item.symbol}</td>
                                                <td>{item.high}</td>
                                                <td>{item.low}</td>
                                                <td>{item.pointchange} ({item.percentchange})</td>
                                                <td>{item.ltp}</td>
                                                <td>{item.previousclosing}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
                </>
            )
        }
        else {
            return <Loading/>;
        }
    }
}

export default TodaysPrice;