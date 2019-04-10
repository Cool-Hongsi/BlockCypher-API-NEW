import React from 'react';
import Address from './components/Address'; // Import another component

import { Route, Switch, withRouter } from 'react-router-dom'; // Router Library
import { TweenMax } from 'gsap'; // Desgin Library
import axios from 'axios'; // Transfer Library

import './App.css';

class App extends React.Component{
  
  constructor(props){
    super(props);

    this.state = {
      address : '',
      data : {},
      generateData : {},
      getCoin : false
    }

    this.generateWallet = this.generateWallet.bind(this);
    this.showAddress = this.showAddress.bind(this);
    this.setData = this.setData.bind(this);
    this.getData = this.getData.bind(this);
    // this.noGenerateWallet = this.noGenerateWallet.bind(this);
  };

  // Check whether lifecycle method is working properly or no
  // componentDidMount(){
  //   fetch('/api').then((res) => {
  //     res.json().then((result) => {
  //       this.setState({
  //         data : result
  //       })
  //     })
  //   })
  // }

  generateWallet(){
    axios.get('/api/generateWallet'); // Have an access to router in nodejs ('/api/generateWallet')

    fetch('/api/generateWallet').then((result) => { // from res.json(data) in router, able to receive the data
      result.json().then((data) => {
        this.setState({
          generateData : data,
          getCoin : !this.state.getCoin // true -> show , false -> hide
        })
      })
    })
  };

  // noGenerateWallet(){
  //   TweenMax.to('.generate-container', 1, {
  //     visibility: 'hidden',
  //     opacity: 0
  //   })

  //   this.setState({
  //     getCoin : false
  //   })
  // }

  setData(e){
    this.setState({
      address : e.target.value // Whenever I typed something in input tag, the data will be stored in address state
    })
  };

  /* getData method will have an access to the data by using BlockCypher API (depending on the paramter (Public Address)) */
  getData(paramAddress){
    fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${paramAddress}/full`).then((result) => {
        result.json().then((resultdata) => {
            this.setState({
              data : resultdata // Store virtual wallet data into this.state.data
            });

            if(this.state.data.txs[0].hash){ // At least one transaction
              this.props.history.push('/address'); // Change URL in order to show another component

              TweenMax.to('.result-container', 2, { // Show the tag which has the classname (result-container)
                display: 'block',
                y: 70,
                opacity: .8
              });
            }
            else{
              // Nothing To Do
            }
          }).catch((err) => {
            console.log(err);
        })
    }).catch((err) => {
        console.log(err);
    })
  };

  showAddress(){
    TweenMax.to('.address-container', 2, { // Show the tag which has the classname (address-container)
      display: 'block',
      y: 40
    });
  };

  render(){
    return(
      <div>
        <div className="generate-container">
          <h3>Would you like to generate wallet ?</h3>
          <button onClick={this.generateWallet}>Yes</button><br/><br/>
          {/* <button onClick={this.noGenerateWallet}>No</button> */}
          <div>Public Address : {this.state.generateData.address}</div>
          <div>Private Key : {this.state.generateData.pk}</div><br/>
          {this.state.getCoin ? <a href="https://tbtc.bitaps.com" target="_blank" onClick={this.showAddress} rel="noopener noreferrer"><button>Get Coin</button></a> : null}
          <br/><br/>
        </div>

        <div className="address-container">
          <input type="text" onChange={this.setData} placeholder="Testnet Address" required /><br/>
          <button onClick={() => this.getData(this.state.address)}>View</button><div className="msg">Click the view button after testnet bitcoin acquires in your wallet</div>
        </div>

        <div className="result-container">
          <Switch>
            <Route exact path="/address" render={() => (
              <Address address={this.state.data.address} balance={this.state.data.final_balance} 
                pk={this.state.generateData.pk} hash={this.state.data.txs[0].hash} />
            )}/>
          </Switch>
        </div>
      </div>
        )
    }
}

export default withRouter(App);