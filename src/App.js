import React, { Component } from 'react';
import './App.css';

import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
    lastWinner: '',
    currentWinner: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const lastWinner = await lottery.methods.lastWinner().call();
    this.setState({ manager, players, balance, lastWinner });
  }

  onSubmit = async (event) => {

    event.preventDefault();
    window.ethereum.enable();

    this.setState({ message: 'Waiting on transaction...' });

    const accounts = await web3.eth.getAccounts();

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async (event) => {

    const accounts = await web3.eth.getAccounts();
    this.setState({ message: 'Waiting on transaction...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
    const winner = await lottery.methods.lastWinner().call();
    this.setState({ currentWinner: winner, lastWinner: winner, message: 'has won!' });
  };

  render() {
    return (
      <div className="container">
        <br />
        <h2>Lottery contract on rinkeby network</h2>
        <hr />
        <h5>This contract is managed by {this.state.manager}</h5>
        <hr />
        <h5>There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether.</h5>
        <hr />
        <h5>Winner of last lottery: {this.state.lastWinner}</h5>
        <hr />
        <form className="form-control-feedback" onSubmit={this.onSubmit}>
          <h4>Want to try your luck? </h4>
          <div>
            Ammount of Ether to enter &nbsp;
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
              type="number"
              required
            />
          </div>
          <button className="btn-primary">Enter</button>
        </form>
        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick} className="btn-primary">Pick a winner!</button>
        <hr />
        <h3>{this.state.currentWinner} {this.state.message}</h3>
      </div>
    );
  }
}

export default App;
