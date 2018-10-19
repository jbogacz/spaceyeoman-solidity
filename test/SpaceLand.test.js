const shouldFail = require('./helpers/shouldFail');
const SpaceLand = artifacts.require('SpaceLand');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('SpaceLand', ([_, yopman, buyer1st, buyer2nd]) => {
  const ROWS = new BigNumber(6);
  const COLUMNS = new BigNumber(6);
  const SIZE = new BigNumber(10);
  const PRICE = web3.toWei('0.1', 'ether');

  beforeEach(async () => {
    this.spaceLand = await SpaceLand.new(ROWS, COLUMNS, SIZE, SIZE, PRICE, { from: yopman });
  });

  it('should have an owner', async () => {
    (await this.spaceLand.owner()).should.equal(yopman);
  });

  describe('lands are bought', () => {
    beforeEach(async () => {
      await this.spaceLand.buy(11, { value: PRICE, from: buyer1st });
      await this.spaceLand.buy(22, { value: PRICE, from: buyer1st });
      await this.spaceLand.buy(33, { value: PRICE, from: buyer2nd });
    });

    it('should keep bought landIds', async () => {
      const allLands = await this.spaceLand.allLands();
      allLands[0].should.be.bignumber.equal(11);
      allLands[1].should.be.bignumber.equal(22);
      allLands[2].should.be.bignumber.equal(33);
    });
  
    it('should revert for invalid landId', async () => {
      await shouldFail.reverting(this.spaceLand.buy((ROWS * COLUMNS) + 1, { value: PRICE }));
    });
  
    it('should revert for invalid land price', async () => {
      await shouldFail.reverting(this.spaceLand.buy(1, { value: web3.toWei('0.05', 'ether') }));
      await shouldFail.reverting(this.spaceLand.buy(1, { value: web3.toWei('0.2', 'ether') }));
    });
  
    it('should revert for already occupied landId', async () => {
      await shouldFail.reverting(this.spaceLand.buy(11, { value: PRICE }));
    });
  
    it('should return correct total supply', async () => {
      const totalSupply = await this.spaceLand.totalSupply();
      totalSupply.should.be.bignumber.equal(3);
    });

    it('should return correct max total supply', async () => {
      const maxTotalSupply = await this.spaceLand.maxTotalSupply();
      maxTotalSupply.should.be.bignumber.equal(ROWS * COLUMNS);
    });
  
    it('should return correct balance of particular buyer', async () => {
      const balanceOfbuyer1st = await this.spaceLand.balanceOf(buyer1st);
      const balanceOfbuyer2nd = await this.spaceLand.balanceOf(buyer2nd);
      balanceOfbuyer2nd.should.be.bignumber.equal(1);
      balanceOfbuyer1st.should.be.bignumber.equal(2);
    });

    it('should return lands for particular address', async () => {
      const buyerLands = await this.spaceLand.landsOf(buyer1st);
      buyerLands.length.should.be.equal(2);
      buyerLands[0].should.be.bignumber.equal(11);
      buyerLands[1].should.be.bignumber.equal(22);
    });

    it('should set owned land details and return stored data', async () => {
      await this.spaceLand.setDetails(11, 'MyName', 'MyDetails', { from: buyer1st });
      const details = await this.spaceLand.getDetails(11);
      details[0].should.be.bignumber.equal(11);
      details[1].should.be.equal('MyName');
      details[2].should.be.equal('MyDetails');
    });

    it('should revert set details for not owned land id', async () => {
      await shouldFail.reverting(this.spaceLand.setDetails(11, 'MyName', 'MyDetails', { from: buyer2nd }));
    });

    it('should revert set details for existing land id', async () => {
      await shouldFail.reverting(this.spaceLand.setDetails(66, 'MyName', 'MyDetails', { from: buyer2nd }));
    });
  });
});
