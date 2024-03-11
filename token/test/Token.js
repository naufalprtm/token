const { expect } = require("chai");

describe("Token Contract", function () {
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
  });

  it("Should deploy and mint initial supply to owner", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should allow owner to mint new tokens", async function () {
    const mintAmount = 1000;
    await token.mint(addr1.address, mintAmount);

    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(mintAmount);
  });

  it("Should allow owner to burn tokens", async function () {
    const burnAmount = 500;
    await token.burn(burnAmount);

    const ownerBalance = await token.balanceOf(owner.address);
    expect(await token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should allow owner to pause and unpause the token", async function () {
    await token.pauseToken();
    expect(await token.paused()).to.be.true;

    await token.unpauseToken();
    expect(await token.paused()).to.be.false;
  });

  it("Should allow owner to pay dividends", async function () {
    const dividendAmount = 200;
    await token.payDividend(addr1.address, dividendAmount);

    const addr1DividendBalance = await token.getDividendBalance(addr1.address);
    expect(addr1DividendBalance).to.equal(dividendAmount);
  });

  it("Should allow owner to schedule vesting", async function () {
    const vestingAmount = 500;
    const start = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const cliff = 3600; // 1 hour
    const duration = 7200; // 2 hours

    await token.scheduleVesting(addr1.address, vestingAmount, start, cliff, duration);

    const vestingSchedule = await token.getVestingSchedule(addr1.address);
    expect(vestingSchedule.active).to.be.true;
  });

  it("Should release vested tokens after cliff period", async function () {
    const vestingAmount = 500;
    const start = Math.floor(Date.now() / 1000) + 1; // 1 second from now
    const cliff = 1; // 1 second
    const duration = 2; // 2 seconds

    await token.scheduleVesting(addr1.address, vestingAmount, start, cliff, duration);

    // Wait for the cliff period to pass
    await new Promise(resolve => setTimeout(resolve, 1000));

    await token.connect(addr1).releaseVestedTokens();

    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(vestingAmount);
  });

  // Add more tests as needed

});
