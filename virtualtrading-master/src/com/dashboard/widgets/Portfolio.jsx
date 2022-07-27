import React, { Component } from 'react';
import { getUserData, VT_BASE } from '../../Helper';
import axios from 'axios';
import { Link, Switch, Route } from "react-router-dom";
import { NotificationManager } from 'react-notifications';
import Loading from './Loading';

class Portfolio extends Component {
    state = {
        portfolio: null,
    }
    componentDidMount() {
        this.loadPortfolio();
    }
    loadPortfolio = () =>{
        const data = getUserData();
        axios({
            method: 'GET',
            url: VT_BASE + "/portfolio/" + data.userid,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("vt-token")
            }
        })
            .then((response) => {
                if(response.data.length>0){
                    this.setState({ portfolio: response.data[0] })
                }
            })
            .catch((error) => {
                console.log("single port:",error.response);
            });
    }
    deleteStock = (symbol) =>{
        if(window.confirm(`Are you sure you want to delete ${symbol} from portfolio?`)){
            axios.delete(VT_BASE+"/portfolio/"+this.state.portfolio.id+"/"+symbol,{
                headers:{
                    "Authorization": "Bearer "+ localStorage.getItem("vt-token")
                }
            }).then((res)=>{
                this.loadPortfolio();
                NotificationManager.success("Stock deleted successfully.")
            },
            (err)=>{
                console.log(err);
                NotificationManager.error("Error occured !")
            }
            )
        }
    }
    render() {

        const { portfolio } = this.state;
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
                                                <li className="breadcrumb-item active">Portfolio</li>
                                            </ol>
                                        </div>
                                        <h4 className="page-title">Portfolio</h4>
                                    </div>
                                </div>
                            </div>
                            {/* {portfolio===null?<Loading />: */}

                            <div className="container-fluid">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Company Symbol</th>
                                            <th>No Of Stock</th>
                                            <th>LTP</th>
                                            <th>Investment</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {portfolio?.allPortfolio?.map((item, index) =>
                                            <tr key={item.stockSymbol}>
                                                <td>{index + 1}</td>
                                                <td>{item.stockSymbol}</td>
                                                <td>{item.totalUnits}</td>
                                                <td>{item.ltp}</td>
                                                <td>Rs {item.investment}</td>
                                                <td>
                                                    <Link to={"/dashboard/company/"+ item.stockSymbol}>
                                                        <button className='btn btn-success btn-sm'>View</button>
                                                    </Link>
                                                    <button
                                                    onClick={()=> this.deleteStock(item.stockSymbol)}
                                                    className='btn btn-danger btn-sm ml-2'>Delete</button>
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

export default Portfolio;