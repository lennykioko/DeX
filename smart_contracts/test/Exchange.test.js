const { expect } = require('chai')
const { ethers } = require('hardhat')
const { ETHER_ADDRESS, ether, tokens } = require('./helper')

describe('Test the Exchange', async () => {
  let exchange
  let token
  let feePercent = 10

  let deployer
  let feeAccount
  let user1
  let user2

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    const [owner, addr1, addr2, addr3] = await ethers.getSigners()
    deployer = owner
    feeAccount = addr1
    user1 = addr2
    user2 = addr3
    token = await Token.deploy()
    await token.deployed()

    await token.transfer(user1.address, tokens(100))

    const Exchange = await ethers.getContractFactory('Exchange')
    exchange = await Exchange.deploy(feeAccount.address, feePercent)
    await exchange.deployed()
  })

  describe('deployment & revert test', async () => {
    it('tracks the fee account', async () => {
      expect(await exchange.feeAccount()).to.equal(feeAccount.address)
    })

    it('tracks the fee percent', async () => {
      expect(await exchange.feePercent()).to.equal(feePercent.toString())
    })

    it('fallback reverts when ether is sent', async () => {
      await expect(
        user1.sendTransaction({ to: exchange.address, value: ether(1) })
      ).to.be.reverted
    })
  })

  describe('depositing Ether', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = ether(1)
      await token.connect(user1).approve(exchange.address, amount)
      result = await exchange.connect(user1).depositEther({ value: amount })
    })

    it('tracks the ether deposit', async () => {
      const balance = await exchange.tokens(ETHER_ADDRESS, user1.address)
      expect(balance.toString()).to.equal(amount.toString())
    })

    it('emits Ether Deposit Event', async () => {
      receipt = await result.wait()
      transactionEvent = receipt?.events?.filter((e) => e.event === 'Deposit')
      expect(transactionEvent[0].event).to.equal('Deposit')
      expect(transactionEvent[0].args.user.toString()).to.equal(user1.address)
      expect(transactionEvent[0].args.amount).to.equal(ether(1).toString())
      expect(transactionEvent[0].args.balance).to.equal(ether(1).toString())
    })
  })

  describe('depositing tokens success', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = tokens(10)
      await token.connect(user1).approve(exchange.address, amount)
      result = await exchange.connect(user1).depositToken(token.address, amount)
    })

    it('tracks the token deposit', async () => {
      const tokenBalance = await token.balanceOf(exchange.address)
      expect(tokenBalance.toString()).to.equal(amount.toString())
      const exchangeBalance = await exchange.tokens(
        token.address,
        user1.address
      )
      expect(exchangeBalance.toString()).to.equal(amount.toString())
    })

    it('emits Token Deposit Event', async () => {
      receipt = await result.wait()
      transactionEvent = receipt?.events?.filter((e) => e.event === 'Deposit')
      expect(transactionEvent[0].event).to.equal('Deposit')
      expect(transactionEvent[0].args.token.toString()).to.equal(token.address)
      expect(transactionEvent[0].args.user.toString()).to.equal(user1.address)
      expect(transactionEvent[0].args.amount).to.equal(tokens(10).toString())
      expect(transactionEvent[0].args.balance).to.equal(tokens(10).toString())
    })
  })

  describe('depositing tokens failure', () => {
    let amount

    beforeEach(async () => {
      amount = tokens(10)
    })

    it('reject ether deposits', async () => {
      await expect(exchange.connect(user1).depositToken(ETHER_ADDRESS, amount))
        .to.be.reverted
    })

    it('reject when no token is approved', async () => {
      await expect(exchange.connect(user1).depositToken(token.address, amount))
        .to.be.reverted
    })
  })

  describe('withdrawing Ether success', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = ether(1)
      await exchange.connect(user1).depositEther({ value: amount })
      result = await exchange.connect(user1).withdrawEther(amount)
    })

    it('withdraws Ether fund', async () => {
      const balance = await exchange.tokens(ETHER_ADDRESS, user1.address)
      expect(balance.toString()).to.equal('0')
    })

    it('emits Ether Withdraw Event', async () => {
      receipt = await result.wait()
      transactionEvent = receipt?.events?.filter((e) => e.event === 'Withdraw')
      expect(transactionEvent[0].event).to.equal('Withdraw')
      expect(transactionEvent[0].args.token.toString()).to.equal(ETHER_ADDRESS)
      expect(transactionEvent[0].args.user.toString()).to.equal(user1.address)
      expect(transactionEvent[0].args.amount).to.equal(ether(1).toString())
      expect(transactionEvent[0].args.balance).to.equal('0')
    })
  })

  describe('withdrawing Ether failure', () => {
    let amount

    beforeEach(async () => {
      amount = ether(1)
      await exchange.connect(user1).depositEther({ value: amount })
    })

    it('rejects withdraws for insufficient funds', async () => {
      const invalidAmount = tokens(100)
      await expect(exchange.connect(user1).withdrawEther(invalidAmount)).to.be
        .reverted
    })
  })

  describe('withdrawing tokens success', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = tokens(10)
      await token.connect(user1).approve(exchange.address, amount)
      await exchange.connect(user1).depositToken(token.address, amount)

      result = await exchange
        .connect(user1)
        .withdrawToken(token.address, amount)
    })

    it('tracks the token withdrawal', async () => {
      const balance = await exchange.tokens(token.address, user1.address)
      expect(balance.toString()).to.equal('0')
    })

    it('emits Token Withdraw Event', async () => {
      receipt = await result.wait()
      transactionEvent = receipt?.events?.filter((e) => e.event === 'Withdraw')
      expect(transactionEvent[0].event).to.equal('Withdraw')
      expect(transactionEvent[0].args.token.toString()).to.equal(token.address)
      expect(transactionEvent[0].args.user.toString()).to.equal(user1.address)
      expect(transactionEvent[0].args.amount).to.equal(tokens(10).toString())
      expect(transactionEvent[0].args.balance).to.equal('0')
    })
  })

  describe('withdrawing tokens failure', () => {
    let amount

    amount = tokens(10)

    it('rejects ether withdrawals', async () => {
      await expect(exchange.connect(user1).withdrawToken(ETHER_ADDRESS, amount))
        .to.be.reverted
    })

    it('rejects for insufficient balances', async () => {
      await expect(exchange.connect(user1).depositToken(token.address, amount))
        .to.be.reverted
    })
  })

  describe('checking balances', async () => {
    let amount

    beforeEach(async () => {
      amount = tokens(10)
      await exchange.connect(user1).depositEther({ value: amount })
    })

    it('returns user balance', async () => {
      const balance = await exchange.balanceOf(ETHER_ADDRESS, user1.address)
      expect(balance.toString()).to.equal(amount.toString())
    })
  })

  describe('making orders', async () => {
    let amount
    let result

    beforeEach(async () => {
      amount = ether(1)
      result = await exchange
        .connect(user1)
        .makeOrder(token.address, tokens(1), ETHER_ADDRESS, amount)
    })

    it('tracks the newly created order', async () => {
      const result = await exchange.orderCount()
      expect(result.toString()).to.equal('1')

      const order = await exchange.orders('1')

      expect(order.id.toString()).to.equal('1')
      expect(order.user.toString()).to.equal(user1.address)
      expect(order.tokenGet.toString()).to.equal(token.address)
      expect(order.amountGet.toString()).to.equal(amount.toString())
      expect(order.tokenGive).to.equal(ETHER_ADDRESS)
      expect(order.amountGive.toString()).to.equal(amount.toString())
      expect(order.timestamp.toString()).length.to.be.at.least(1)
    })

    it('emits Order Event', async () => {
      receipt = await result.wait()
      transactionEvent = receipt?.events?.filter((e) => e.event === 'Order')
      expect(transactionEvent[0].event).to.equal('Order')
      expect(transactionEvent[0].args.id.toString()).to.equal('1')
      expect(transactionEvent[0].args.user.toString()).to.equal(user1.address)
      expect(transactionEvent[0].args.tokenGet.toString()).to.equal(
        token.address
      )
      expect(transactionEvent[0].args.amountGet).to.equal(amount.toString())
      expect(transactionEvent[0].args.tokenGive.toString()).to.equal(
        ETHER_ADDRESS
      )
      expect(transactionEvent[0].args.amountGive).to.equal(amount.toString())
      expect(
        transactionEvent[0].args.timestamp.toString()
      ).length.to.be.at.least(1)
    })
  })

  describe('order actions', async () => {
    let amount

    beforeEach(async () => {
      amount = ether(1)
      await exchange.connect(user1).depositEther({ value: amount })
      await token.transfer(user2.address, tokens(100))
      await token.connect(user2).approve(exchange.address, tokens(2))
      await exchange.connect(user2).depositToken(token.address, tokens(2))
      await exchange
        .connect(user1)
        .makeOrder(token.address, tokens(1), ETHER_ADDRESS, amount)
    })

    describe('filling orders success', () => {
      let result

      beforeEach(async () => {
        result = await exchange.connect(user2).fillOrder('1')
      })

      it('executes the trade & charges fees', async () => {
        const tokenBalance = await exchange.balanceOf(
          token.address,
          user1.address
        )
        expect(tokenBalance.toString()).to.equal(tokens(1).toString())
        const exchangeBalance2 = await exchange.balanceOf(
          ETHER_ADDRESS,
          user2.address
        )
        expect(exchangeBalance2.toString()).to.equal(tokens(1).toString())

        exchangeBalance1 = await exchange.balanceOf(
          ETHER_ADDRESS,
          user1.address
        )
        expect(exchangeBalance1.toString()).to.equal('0')

        exchangeBalance3 = await exchange.balanceOf(
          token.address,
          user2.address
        )
        expect(exchangeBalance3.toString()).to.equal(tokens(0.9).toString())

        const feeAccount = await exchange.feeAccount()
        feeAccBalance = await exchange.balanceOf(token.address, feeAccount)
        expect(feeAccBalance.toString()).to.equal(tokens(0.1).toString())
      })

      it('updates filled orders', async () => {
        const orderFilled = await exchange.orderFilled(1)
        expect(orderFilled).to.equal(true)
      })

      it('emits Trade Event', async () => {
        receipt = await result.wait()
        transactionEvent = receipt?.events?.filter((e) => e.event === 'Trade')
        expect(transactionEvent[0].event).to.equal('Trade')
        expect(transactionEvent[0].args.id.toString()).to.equal('1')
        expect(transactionEvent[0].args.user.toString()).to.equal(user1.address)
        expect(transactionEvent[0].args.tokenGet.toString()).to.equal(
          token.address
        )
        expect(transactionEvent[0].args.amountGet).to.equal(amount.toString())
        expect(transactionEvent[0].args.tokenGive.toString()).to.equal(
          ETHER_ADDRESS
        )
        expect(transactionEvent[0].args.amountGive).to.equal(amount.toString())
        expect(
          transactionEvent[0].args.timestamp.toString()
        ).length.to.be.at.least(1)
      })
    })

    describe('filling orders failure', () => {
      it('rejects invalid order ids', async () => {
        const invalidOrderId = 9999
        await expect(exchange.connect(user2).fillOrder(invalidOrderId)).to.be
          .reverted
      })

      it('rejects already filled orders', async () => {
        await exchange.connect(user2).fillOrder('1')
        await expect(exchange.connect(user2).fillOrder('1')).to.be.reverted
      })

      it('reject cancelled orders', async () => {
        await exchange.connect(user1).cancelOrder('1')
        await expect(exchange.connect(user2).fillOrder('1')).to.be.reverted
      })
    })

    describe('cancelling orders success', () => {
      let result

      beforeEach(async () => {
        result = await exchange.connect(user1).cancelOrder('1')
      })

      it('tracks the newly created order', async () => {
        const orderCancelled = await exchange.orderCancelled(1)
        expect(orderCancelled).to.equal(true)
      })

      it('emits Cancel Event', async () => {
        receipt = await result.wait()
        transactionEvent = receipt?.events?.filter((e) => e.event === 'Cancel')
        expect(transactionEvent[0].event).to.equal('Cancel')
        expect(transactionEvent[0].args.id.toString()).to.equal('1')
        expect(transactionEvent[0].args.user.toString()).to.equal(user1.address)
        expect(transactionEvent[0].args.tokenGet.toString()).to.equal(
          token.address
        )
        expect(transactionEvent[0].args.amountGet).to.equal(amount.toString())
        expect(transactionEvent[0].args.tokenGive.toString()).to.equal(
          ETHER_ADDRESS
        )
        expect(transactionEvent[0].args.amountGive).to.equal(amount.toString())
        expect(
          transactionEvent[0].args.timestamp.toString()
        ).length.to.be.at.least(1)
      })
    })

    describe('cancelling orders failure', () => {
      it('rejects invalid order ids', async () => {
        const invalidOrderId = 9999
        await expect(exchange.connect(user1).cancelOrder(invalidOrderId)).to.be
          .reverted
      })
      it('reject unauthorized cancellations', async () => {
        await expect(exchange.connect(user2).cancelOrder('1')).to.be.reverted
      })
    })
  })
})
