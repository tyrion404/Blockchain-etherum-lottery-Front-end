import Web3 from 'web3';

let web3;

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
        window.ethereum.enable().then(function () {

        });
    } catch (e) { }
}

else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
}

else {
    alert('You have to install MetaMask !');
}

export default web3;