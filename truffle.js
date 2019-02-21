const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    rinkeby: {
        provider: function() {
            return new HDWalletProvider(
              '',
              ''
          )},
        network_id: 3
      }
  },
};