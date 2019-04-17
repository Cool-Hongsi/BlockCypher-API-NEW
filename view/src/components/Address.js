import React from 'react';
import Database from './Database';

import axios from 'axios';
import { Button, Container, Row, Col } from 'reactstrap';

import './Address.css';

export default class Address extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            form : { // In order to receive and store the data from user whenever the user inputs something inside of input tag.
                payToAddress : '',
                payToAmount : ''
            },
            hexValue : '',
            showLink : false,
            showdb : false
        }

        this.setData = this.setData.bind(this);
        this.sendData = this.sendData.bind(this);
        this.showDB = this.showDB.bind(this);
    }

    setData(e){ // Whenever I typed something in input tag, the data will be stored in address state depending on name property
        var name = e.target.name; // Each input name property
        var value = e.target.value; // Each input value property

        this.setState({
            form :{
                ...this.state.form, // Spread ES6
                [name] : value
            }
        })
    }

    sendData(){

        // First Trial
        // var newtx = {
        //     inputs: [{addresses: [this.props.address]}],
        //     outputs: [{addresses: [this.state.form.payToAddress], value: this.state.form.payToAmount}]
        // };

        // console.log(newtx.inputs[0].addresses[0]);
        // console.log(newtx.outputs[0].addresses[0]);
        // console.log(newtx.outputs[0].value);
        
        // axios.post('https://api.blockcypher.com/v1/bcy/test/txs/new', JSON.stringify(newtx)).then(() => {
        //     console.log("Success");
        // }).catch((err) => {
        //     console.log(err);
        // })

        // Second Trial
        // Have an access to router in nodejs ('/api/payment/') and send some data with body value,
        // Once nodejs received the request from frontend, deal with some works and transfer the response to frontend via then method
        axios.post(`/api/payment`, {amount : this.state.form.payToAmount, payFromAddress : this.props.address, 
            payToAddress : this.state.form.payToAddress, hash : this.props.hash, pk : this.props.pk}).then((result) => {
                this.setState({
                    hexValue : result.data, // Definitely should put .data because the response value is object : { data : {} ~~ 
                    showLink : true
                })
            }).catch((err) => {
                console.log(err);
        })
    };

    showDB(){
        this.setState({
            showdb : true
        })
    }
    
    render(){
        return(
            <div>
                <div className="address-info-container">
                    <div className="address-info">
                        <div className="address-info-section">
                            <Container>
                                <Row>
                                    <Col xs="12" sm="12" md="12" lg="6" xl="6">
                                        <div className="left">
                                            <div className="balance-address">{this.props.address}</div>
                                            {/* <div>Private Key : {this.props.pk}</div> */}
                                            <div className="balance-value">{parseFloat(this.props.balance) / 100000000} BTC</div>
                                            {/* <h3>Hash : {this.props.hash}</h3> */}
                                        </div>
                                    </Col>
                                    <Col xs="12" sm="12" md="12" lg="6" xl="6">
                                        <div className="right">
                                            <input className="pay-to-address" type="text" name="payToAddress" onChange={this.setData} placeholder="Pay To Address" required /><br/><br/>
                                            <input className="pay-to-amount" type="text" name="payToAmount" onChange={this.setData} placeholder="Amount" required /><br/><br/>
                                            <Button className="pay-to-btn" color="danger" onClick={this.sendData}>Payment</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                </div>      
                <br/>

                <div className="hex-container">
                    <div className="hex-container-title">Hash Code</div>
                    <input className="hex-container-input" type="text" style={{width:"100%", height:"40px"}} value={this.state.hexValue} readOnly /><br/><br/>
                    {this.state.showLink ? <a href="https://live.blockcypher.com/btc-testnet/pushtx/" target="_blank" onClick={this.showDB} rel="noopener noreferrer"><Button className="send-hashcode-btn" color="primary">Send Hash Code</Button></a> : null}<br/><br/>
                </div>
                
                {this.state.showdb ? <Database address={this.props.address} /> : null}
                {/* The value of this.state.showdb is true -> show the Database component, otherwise, ignore (null) */}
            </div>
        )
    }
}