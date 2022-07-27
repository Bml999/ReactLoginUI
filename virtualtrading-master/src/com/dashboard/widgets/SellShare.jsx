import React, { Component } from 'react';
import { isUserLoggedIn, getUserData, VT_BASE, Logout } from '../../Helper';
import axios from 'axios';
import 'react-notifications/lib/notifications.css';
import { Link, Switch, Route } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Select from 'react-select';

import Loading from './Loading';

class SellShare extends Component {
    state = {
        quantity: 10,
        price: 0,
        loading: false,
    }
    componentDidMount() {

    }
    getAvailableQuantity = () => {
        const { data, portfolio } = this.props;
        const filter = portfolio?.allPortfolio.filter((item)=>
            item.stockSymbol===data.symbol
        )
        if(filter.length>0){
            return filter[0].totalUnits
        }
        return 0;
    }
    changeQuantity = val => {
        this.setState({ quantity: val.target.value })
    }
    changePrice = val => {
        this.setState({ price: val.target.value })
    }
    handleSell = () => {
        const user = getUserData();
        var shares = this.getAvailableQuantity();
        const {data, portfolio} = this.props;
        const {quantity, price} = this.state;
        if(shares<this.state.quantity){
            NotificationManager.error('Invalid share quantity.',"Quantity Error");
            return;
        }
        const raw_data = {
            stockSymbol:data?.symbol,
            totalUnits: quantity,
            wacc: price,
            userId:user.userid,
            transcationType:"SECONDARY_SELL",
            transcationDate:new Date().toString(),
            portfolioSummaryId: portfolio.id
        }
        this.setState({loading: true})
        axios({
            method: 'POST',
            url: VT_BASE + "/portfolio/",
            data: raw_data,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("vt-token")
            }
        })
            .then((response) => {
                this.setState({loading: false})
                NotificationManager.success("Sell successfull.")
            })
            .catch((error) => {
                this.setState({loading: false});
                NotificationManager.success("Sell Error :", error.message)
            });
    }
    render() {
        const { loading, quantity, price } = this.state;
        const {portfolio} = this.props;
        if (portfolio != null) {
            const shares = this.getAvailableQuantity();
            if (shares===0){
                return(
                    <div className="form-group">
                        <p className="text-warning">Not enough share quantity for this company.</p>
                        <Link to="/dashboard/portfolio/">
                            <button className="btn btn-primary">View Portfolio</button>
                        </Link>
                    </div>
                )
            }
            return (
                <>
                    <div className="form-group">
                        <label>Quantity (Available: {this.getAvailableQuantity()} Units)</label>
                        <input type="number" className="form-control" defaultValue={quantity}
                            onChange={(val) => this.changeQuantity(val)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Unit Price</label>
                        <input type="number" className="form-control" defaultValue={price}
                            onChange={(val) => this.changePrice(val)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Total Price</label>
                        <input type="number" className="form-control" value={price * quantity} readOnly />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary"
                            onClick={() => this.handleSell()}
                            
                        >{loading?"Processing...": "Sell"}</button>
                    </div>
                </>
            );
        }
        else {
            return <Loading />
        }
    }
}

export default SellShare;