import React from 'react';
import axios from 'axios';

export default class Address extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            form : {
                payToAddress : '',
                payToAmount : ''
            },
            hexValue : '',
            showLink : false,
            row : []
        }

        this.setData = this.setData.bind(this);
        this.sendData = this.sendData.bind(this);
        this.addDatabase = this.addDatabase.bind(this);
        this.showDatabase = this.showDatabase.bind(this);
    }

    setData(e){ // Whenever I typed something in input tag, the data will be stored in address state depending on name property
        var name = e.target.name;
        var value = e.target.value;

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
                    showLink : !this.state.showLink
                })
            }).catch((err) => {
                console.log(err);
        })
    };

    addDatabase(paramAddr){
        axios.post('/api/addDatabase', {addr : paramAddr});
    };

    showDatabase(){
        axios.get('/api/showDatabase').then((rows) => {
            this.setState({
                row : rows.data // Definitely put .data likewise above
            });
        }).catch((err) => {
            console.log(err);
        })
    };
    
    render(){
        return(
            <div>            
                <h3>Address : {this.props.address}</h3>
                <h3>Private Key : {this.props.pk}</h3>
                <h3>Balance : {parseFloat(this.props.balance) / 100000000} BTC</h3><hr/>
                <h3>Hash : {this.props.hash}</h3>
                <br/>
                
                <input type="text" name="payToAddress" onChange={this.setData} placeholder="Pay To" required /><br/>
                <input type="text" name="payToAmount" onChange={this.setData} placeholder="Amount" required /><br/>
                <button onClick={this.sendData}>Payment</button>

                <hr/>
                <h2>Hex : {this.state.hexValue}</h2>
                {this.state.showLink ? <a href="https://live.blockcypher.com/btc-testnet/pushtx/" target="_blank" onClick={this.showAddress} rel="noopener noreferrer"><button>Send Hex Code</button></a> : null}<br/><br/>
                <button onClick={() => this.addDatabase(this.props.address)}>Add Transaction</button>
                <button onClick={this.showDatabase}>Show Transaction</button>
                <table>
                    <thead>
                        <tr>
                            <th>HASH</th>
                            <th>REGISTRATION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.row.map((el) => {
                            return(
                                <tr>
                                    <td>{el.HASHCODE}</td>
                                    <td>{el.REGISTRATION}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}