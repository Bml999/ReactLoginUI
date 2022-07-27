import React, { Component } from 'react';
import { isUserLoggedIn, getUserData, VT_BASE, Logout } from '../../Helper';
import axios from 'axios';
import 'react-notifications/lib/notifications.css';
import { Link, Switch, Route } from "react-router-dom";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Select from 'react-select';
import Loading from './Loading';

class BuyShare extends Component {
    state = {
        quantity: 10,
        loading: false,
    }
    componentDidMount(){
        const data = getUserData();
    }
    changeQuantity = val =>{
        this.setState({quantity: val.target.value})
    }
    handleBuy = () =>{
        const user = getUserData();
        const {data={}, portfolio={}} = this.props;
        const {quantity} = this.state;
        // if(data === null || !portfolio.hasOwnProperty("id")){
        //     NotificationManager.error("Buy error occured!!!")
        // }
        this.setState({loading: true})
        const raw_data = {
            stockSymbol:data?.symbol,
            totalUnits: quantity,
            wacc: data?.marketPrice.replace(/,/,""),
            userId:user.userid,
            transcationType:"SECONDARY_BUY",
            transcationDate:new Date().toString(),
            portfolioSummaryId: portfolio.id
        }
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
                NotificationManager.success("Buy successfull.")
            })
            .catch((error) => {
                this.setState({loading: false});
                NotificationManager.success("Buy Error :", error.message)
            });
    }
    render() {
        const {quantity,loading} = this.state;
        const {data} = this.props;
        if(data !== null){
        return ( 
            <>
                <div className="form-group">
                    <label>Share Quantity</label>
                    <input type="number" className="form-control" defaultValue={this.state.quantity}
                    onChange={(val)=>this.changeQuantity(val)}
                    />
                </div>
                <div className="form-group">
                    <label>Unit Price</label>
                    <input type="text" className="form-control" defaultValue={data.marketPrice.replace(/,/,"")} readOnly />
                </div>
                <div className="form-group">
                    <label>Total Price</label>
                    <input type="number" className="form-control" value={data.marketPrice.replace(/,/,"")*quantity} readOnly/>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary"
                    onClick={()=>this.handleBuy()}
                    >{
                        loading?"Processing...":"Buy"
                    }</button>
                </div>
            </>
         );
    }
    else {
        return <Loading/>
    }
}
}
 
export default BuyShare;