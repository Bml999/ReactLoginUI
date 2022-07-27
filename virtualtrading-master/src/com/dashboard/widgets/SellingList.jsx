import React, { Component } from 'react';
import { getUserData, VT_BASE } from '../../Helper';
import axios from 'axios';
import { Link, Switch, Route } from "react-router-dom";

import Loading from './Loading';

class SellingList extends Component {
    state = {
        list: null,
    }
    componentDidMount() {
        const data = getUserData();
        axios({
            method: 'GET',
            url: VT_BASE + "/trading/sellshare/user/" + data.id,
            headers: {
                'Authorization': 'Token ' + data.token
            }
        })
            .then((response) => {
                console.log(response);
                this.setState({ list: response.data.results })
            })
            .catch((error) => {
                //console.log(error.response);
            });
    }
    render() {
        const { list } = this.state;
        if (list === null) {
            return (<Loading />)
        }
        else {
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
                                                <li className="breadcrumb-item active">Transactions</li>
                                            </ol>
                                        </div>
                                        <h4 className="page-title">Selling List</h4>
                                    </div>
                                </div>
                            </div>


                            <div className="container-fluid">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Company Symbol</th>
                                            <th>No Of Stock</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.map((item, index) =>
                                            <tr key={item.symbol}>
                                                <td>{index + 1}</td>
                                                <td>{item.symbol}</td>
                                                <td>{item.no_of_stock}</td>
                                                <td>{item.closing_price}</td>
                                                <td>
                                                    <Link to={"/dashboard/company/"+ item.symbol}>
                                                        <button className='btn btn-success btn-sm'>View Company</button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
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

            )
        }
    }
}

export default SellingList;