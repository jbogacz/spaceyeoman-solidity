var SpaceLand = artifacts.require("./SpaceLand.sol");

const ROWS = new web3.BigNumber(10);
const COLUMNS = new web3.BigNumber(16);
const SIZE = new web3.BigNumber(10);
const PRICE = web3.toWei('0.1', 'ether');


module.exports = function(deployer, network, accounts) {
    console.log(`Deploying 'Factory' contract to '${network}' network.`);
    console.log(accounts)
    deployer.deploy(
        SpaceLand, ROWS, COLUMNS, SIZE, SIZE, PRICE,
        { from: accounts[2] }
    );
};
