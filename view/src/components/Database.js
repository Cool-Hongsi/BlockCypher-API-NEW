import React from 'react';

import axios from 'axios';
import { Button, Table } from 'reactstrap';
import { TweenMax } from 'gsap';

import './Database.css';

export default class Database extends React.Component{
    
    constructor(props){
        super(props);

        this.state = {
            addr : this.props.address,
            row : []
        }

        this.addDatabase = this.addDatabase.bind(this);
        this.showDatabase = this.showDatabase.bind(this);
    }

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

        TweenMax.to(".db-table-container", 3, { // Show tag which has the classname(.db-table-container)
            opacity: .8
        })
    };

    render(){
        return(
            <div>
                <div className="db-container">
                    <div className="db-container-title">Database</div><br/><br/>
                    <Button className="db-add-txs" color="primary" onClick={() => this.addDatabase(this.state.addr)}>Add Transaction</Button><br/><br/>
                    <Button className="db-show-txs" color="danger" onClick={this.showDatabase}>Show Transaction</Button><br/><br/><br/><br/>
                    <div className="db-table-container">
                    {/* table contents will be indicated after the user click the show transaction button (will receive the data from database) */}
                        <Table striped className="db-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>HASHCODE</th>
                                    <th>FROM</th>
                                    <th>TO</th>
                                    <th>AMOUNT</th>
                                    <th>FEE</th>
                                    <th>REGISTRATION</th>
                                </tr>
                            </thead>
                            <tbody>
                            {/* By using map method, I'm able to have an access to each index */}
                                {this.state.row.map((el, index) => {
                                    return(
                                        <tr>
                                            <td>{index}</td>
                                            <td>{el.HASHCODE}</td>
                                            <td>{el.FROMPUBADD}</td>
                                            <td>{el.TOPUBADD}</td>
                                            <td>{el.AMOUNT}</td>
                                            <td>{el.FEE}</td>
                                            <td>{el.RESGISTRATION}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}