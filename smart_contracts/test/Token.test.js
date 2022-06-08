const { expect } = require('chai')
const { ethers } = require('hardhat')
const { tokens } = require('./helper')

describe('Test the Token', async () => {
  let token
  let deployer
  let receiver
  let exchange
  const totalSupply = tokens(1000000)

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    const [owner, addr1, addr2] = await ethers.getSigners()
    deployer = owner
    receiver = addr1
    exchange = addr2
    token = await Token.deploy()
    await token.deployed()
  })

  describe('deployment', async () => {
    it('tracks successful deployment', async () => {
      console.log(`contract address: ${token.address}`)
      expect(token).to.not.equal(null)
      expect(token).to.not.equal(undefined)
    })

    it('tracks the name', async () => {
      expect(await token.name()).to.equal('DApp Token')
    })

    it('tracks the symbol', async () => {
      expect(await token.symbol()).to.equal('DAPP')
    })

    it('tracks the decimals', async () => {
      expect(await token.decimals()).to.equal('18')
    })

    it('tracks the total supply', async () => {
      const result = await token.totalSupply()
      expect(result.toString()).to.equal(totalSupply.toString())
    })

    it('assigns total supply to the deployer', async () => {
      const deployerBalance = await token.balanceOf(deployer.address)
      expect(deployerBalance.toString()).to.equal(totalSupply.toString())
    })
  })

  describe('sending tokens success', () => {
    let amount
    let result

    beforeEach(async () => {
      amount = tokens(100)
      result = await token.transfer(receiver.address, amount)
    })

    it('transfers token balances', async () => {
      const senderBalance = await token.balanceOf(deployer.address)
      expect(senderBalance.toString()).to.equal(tokens(999900).toString())
      const receiverBalance = await token.balanceOf(receiver.address)
      expect(receiverBalance.toString()).to.equal(tokens(100).toString())
    })

    it('emits transfer event', async () => {
      receipt = await result.wait()
      transactionEvent = receipt?.events?.filter((e) => e.event === 'Transfer')
      expect(transactionEvent[0].event).to.equal('Transfer')
      expect(transactionEvent[0].args.from.toString()).to.equal(
        deployer.address
      )
      expect(transactionEvent[0].args.to).to.equal(receiver.address)
      expect(transactionEvent[0].args.value).to.equal(amount.toString())
    })
  })

  describe('sending tokens failure', () => {
    it('reject insufficient balances', async () => {
      const invalidAmount = tokens(100000000)
      await expect(token.transfer(receiver.address, invalidAmount)).to.be
        .reverted

      const invalidAmount2 = tokens(10)
      await expect(
        token
          .connect(receiver.address)
          .transfer(deployer.address, invalidAmount2)
      ).to.be.reverted
    })

    it('rejects invalid recipients', async () => {
      await expect(token.transfer(0x0, tokens(100))).to.be.reverted
    })
  })

  describe('approving tokens success', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = tokens(100)
      result = await token.approve(exchange.address, amount)
    })

    it('allocates an allowance for delegated token spending on exchange', async () => {
      const allowance = await token.allowance(
        deployer.address,
        exchange.address
      )
      expect(allowance.toString()).to.equal(amount.toString())
    })

    it('emits approval event', async () => {
      receipt = await result.wait()
      approvalEvent = receipt?.events?.filter((e) => e.event === 'Approval')
      expect(approvalEvent[0].event).to.equal('Approval')
      expect(approvalEvent[0].args.owner).to.equal(deployer.address)
      expect(approvalEvent[0].args.spender).to.equal(exchange.address)
      expect(approvalEvent[0].args.value).to.equal(amount.toString())
    })
  })

  // -------------------------------------------------------------------------

  describe('delegated token transfers success', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = tokens(100)
      result = await token.approve(exchange.address, amount)
      result = await token
        .connect(exchange)
        .transferFrom(deployer.address, receiver.address, amount)
    })

    it('transfers token balances', async () => {
      const senderBalance = await token.balanceOf(deployer.address)
      expect(senderBalance.toString()).to.equal(tokens(999900).toString())
      const receiverBalance = await token.balanceOf(receiver.address)
      expect(receiverBalance.toString()).to.equal(tokens(100).toString())
    })

    it('resets the allowance', async () => {
      const allowance = await token.allowance(
        deployer.address,
        exchange.address
      )
      expect(allowance.toString()).to.equal('0')
    })

    it('emits transfer event', async () => {
      receipt = await result.wait()
      transactionEvent = receipt?.events?.filter((e) => e.event === 'Transfer')
      expect(transactionEvent[0].event).to.equal('Transfer')
      expect(transactionEvent[0].args.from.toString()).to.equal(
        deployer.address
      )
      expect(transactionEvent[0].args.to).to.equal(receiver.address)
      expect(transactionEvent[0].args.value).to.equal(amount.toString())
    })
  })

  describe('delegated token transfers failure', () => {
    it('reject insufficient balances', async () => {
      const invalidAmount = tokens(100000000)
      await expect(
        token
          .connect(exchange)
          .transferFrom(deployer.address, receiver.address, invalidAmount)
      ).to.be.reverted
    })

    it('rejects invalid recipients', async () => {
      await expect(
        token.connect(exchange).transferFrom(deployer.address, 0x0, tokens(100))
      ).to.be.reverted
    })
  })
})
