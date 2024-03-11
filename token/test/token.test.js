// test/token.test.js
const { expect } = require('chai');

describe('Token contract', function () {
    it('Should deploy Token contract', async function () {
        console.log("Running test: Should deploy Token contract");

        const Token = await ethers.getContractFactory('Token');
        const token = await Token.deploy();

        await token.deployed();

        expect(await token.name()).to.equal('tokentea');
        expect(await token.symbol()).to.equal('TEAtest');
    });

    it('Should have initial supply of 1,000,000 tokens', async function () {
        console.log("Running test: Should have initial supply of 1,000,000 tokens");

        const Token = await ethers.getContractFactory('Token');
        const token = await Token.deploy();

        await token.deployed();

        const initialSupply = await token.totalSupply();
        expect(initialSupply).to.equal(1000000);
    });

    it('Should transfer tokens between accounts', async function () {
        console.log("Running test: Should transfer tokens between accounts");

        const Token = await ethers.getContractFactory('Token');
        const token = await Token.deploy();

        await token.deployed();

        const [account1, account2, account3] = await ethers.getSigners();

        // Transfer 100 tokens from account1 to account2
        await token.transfer(account2.address, 100);
        const balanceAccount1 = await token.balanceOf(account1.address);
        const balanceAccount2 = await token.balanceOf(account2.address);

        console.log('Balance of Account 1 after transfer:', balanceAccount1.toString());
        console.log('Balance of Account 2 after transfer:', balanceAccount2.toString());

        expect(balanceAccount1).to.equal(999900); // Initial supply - 100
        expect(balanceAccount2).to.equal(100);

        // Transfer 50 tokens from account2 to account3
        await token.connect(account2).transfer(account3.address, 50);
        const balanceAccount3 = await token.balanceOf(account3.address);

        console.log('Balance of Account 2 after second transfer:', balanceAccount2.toString());
        console.log('Balance of Account 3 after transfer:', balanceAccount3.toString());

        expect(balanceAccount2).to.equal(50); // Remaining balance after transfer
        expect(balanceAccount3).to.equal(50); // Transferred tokens
    });

    it('Should not allow non-owner to mint new tokens', async function () {
        console.log("Running test: Should not allow non-owner to mint new tokens");

        const Token = await ethers.getContractFactory('Token');
        const token = await Token.deploy();

        await token.deployed();
        const [account1] = await ethers.getSigners();

        // Attempt to mint 100,000 tokens by non-owner
        await expect(token.connect(account1).mint(account1.address, 100000)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should allow owner to mint new tokens', async function () {
        console.log("Running test: Should allow owner to mint new tokens");

        const Token = await ethers.getContractFactory('Token');
        const token = await Token.deploy();

        await token.deployed();

        // Mint 100,000 tokens by the owner
        await token.mint(token.owner(), 100000);
        const totalSupply = await token.totalSupply();

        console.log('Total supply after minting:', totalSupply.toString());

        expect(totalSupply).to.equal(1100000); // Initial supply + minted tokens
    });

    it('Should burn tokens from the owner account', async function () {
        console.log("Running test: Should burn tokens from the owner account");

        const Token = await ethers.getContractFactory('Token');
        const token = await Token.deploy();

        await token.deployed();

        // Burn 50,000 tokens from the owner's account
        await token.burn(50000);
        const totalSupply = await token.totalSupply();

        console.log('Total supply after burning tokens:', totalSupply.toString());

        expect(totalSupply).to.equal(950000); // Initial supply - burned tokens
    });

    it('Should not allow non-owner to burn tokens', async function () {
        console.log("Running test: Should not allow non-owner to burn tokens");

        const Token = await ethers.getContractFactory('Token');
        const token = await Token.deploy();

        await token.deployed();
        const [account1] = await ethers.getSigners();

        // Attempt to burn 10,000 tokens by non-owner
        await expect(token.connect(account1).burn(10000)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    // Add more test cases as needed
});
