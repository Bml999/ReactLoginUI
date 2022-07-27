import React, { Component } from 'react';
import axios from 'axios';
import { VT_BASE, getUserData } from '../../Helper';
import Loading from './Loading';
class NEPSE extends Component {
    state = {
        data: {},
        nepse: {}
    }
    componentDidMount() {
        axios({
            method: 'GET',
            url: VT_BASE + "/scrape-data/indicies-subindicies",
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("vt-token")
            }
        })
            .then((response) => {
                this.setState({ data: response.data });
                const nepse = response.data.results.filter((item)=> item.indicesName==="NEPSE");
                if(nepse.length>0){
                this.setState({nepse: nepse[0]})
                }
            })
            .catch((error) => {
                console.log(error.response);
            })
    }
    render() {
        const { data, nepse } = this.state;
            return (
                        <div className="card-box">

                            <h4 className="header-title mb-3">NEPSE</h4>
                            {!data.hasOwnProperty("date")? <Loading/>:
                            <div>
                                <h3>{nepse?.currentPrice}</h3>
                                <small>CHANGE </small>
                                <h4 style={{marginTop: 0}}>{nepse?.pointsChange} ( {nepse?.percentChange})</h4>
                                <br />
                                <small> As of {data?.date}</small>
                            </div>
    }
                        </div>
            )
    }
}

export default NEPSE;