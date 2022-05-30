const { ETHER_ADDRESS, tokens, ether } = require('./helper')

const { ethers } = require('hardhat')
const { expect } = require('chai')

describe('Exchange', async () => {
  let exchange, token, feeAccount, user1, user2
  let feePercent = 10

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('Token')
    const Exchange = await ethers.getContractFactory('Exchange')
    const accounts = await ethers.getSigners()

    // We start from the 2nd Address as the first one is default for deployer
    feeAccount = accounts[1]
    user1 = accounts[2]
    user2 = accounts[3]

    token = await Token.deploy()
    exchange = await Exchange.deploy(feeAccount.address, feePercent)
    await token.deployed()
    await exchange.deployed()

    token.transfer(user1.address, tokens(100))
  })

  describe('deployment', () => {
    it('tracks the fee account', async () => {
      const result = await exchange.feeAccount()
      expect(result).to.equal(feeAccount.address)
    })

    it('tracks the fee percent', async () => {
      const result = await exchange.feePercent()
      expect(result).to.equal(feePercent)
    })
  })

  describe('fallback', () => {
    it('reverts when ether is sent', async () => {
      await expect(
        exchange.connect(user1).sendTransaction({
          value: 1,
        })
      ).to.be.reverted
      // await expect(
      //   exchange.sendTransaction({
      //     from: user1,
      //     value: 1,
      //   })
      // ).to.be.revertedWith(EVM_REVERT)
    })
  })

  describe('depositing Ether', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = ether(1)
      await token.connect(user1).approve(exchange.address, amount)
      result = await exchange.connect(user1).depositEther({
        value: amount,
      })
    })

    it('tracks the ether deposit', async () => {
      let balance
      balance = await exchange.tokens(ETHER_ADDRESS, user1.address)
      expect(balance.toString()).to.equal(amount.toString())
    })

    it('emits Ether Deposit Event', async () => {
      let log = await result.wait()
      log = log.events[0]
      expect(log.event).to.equal('Deposit')
      const event = { ...log.args }
      expect(event.token.toString()).to.equal(
        ETHER_ADDRESS,
        'token address is correct'
      )
      expect(event.user.toString()).to.equal(
        user1.address,
        'user address is correct'
      )
      expect(event.amount.toString()).to.equal(
        ether(1).toString(),
        'amount is correct'
      )
      expect(event.balance.toString()).to.equal(
        ether(1).toString(),
        'balance is correct'
      )
    })
  })

  describe('depositing tokens', () => {
    let result
    let amount

    describe('success', () => {
      beforeEach(async () => {
        amount = tokens(10)
        await token.connect(user1).approve(exchange.address, amount)
        result = await exchange
          .connect(user1)
          .depositToken(token.address, amount)
      })

      it('tracks the token deposit', async () => {
        let balance
        balance = await token.balanceOf(exchange.address)
        expect(balance.toString()).to.equal(amount.toString())
        balance = await exchange.tokens(token.address, user1.address)
        expect(balance.toString()).to.equal(amount.toString())
      })

      it('emits Token Deposit Event', async () => {
        let log = await result.wait()
        log = log.events[1]
        expect(log.event).to.equal('Deposit')
        const event = { ...log.args }
        expect(event.token.toString()).to.equal(
          token.address,
          'token address is correct'
        )
        expect(event.user.toString()).to.equal(
          user1.address,
          'user address is correct'
        )
        expect(event.amount.toString()).to.equal(
          tokens(10).toString(),
          'amount is correct'
        )
        expect(event.balance.toString()).to.equal(
          tokens(10).toString(),
          'balance is correct'
        )
      })
    })

    describe('failure', () => {
      amount = tokens(10)
      it('reject ether deposits', async () => {
        await expect(
          exchange.connect(user1).depositToken(ETHER_ADDRESS, amount)
        ).to.be.reverted
      })

      it('reject when no token is approved', async () => {
        await expect(
          exchange.connect(user1).depositToken(token.address, amount)
        ).to.be.reverted
      })
    })
  })

  describe('withdrawing Ether', () => {
    let result
    let amount

    beforeEach(async () => {
      amount = ether(1)
      result = await exchange.connect(user1).depositEther({
        value: amount,
      })
    })

    describe('success', () => {
      beforeEach(async () => {
        amount = ether(1)
        result = await exchange.connect(user1).withdrawEther(amount)
      })
      it('withdraws Ether fund', async () => {
        let balance
        balance = await exchange.tokens(ETHER_ADDRESS, user1.address)
        expect(balance.toString()).to.equal('0')
      })
      it('emits Ether Withdraw Event', async () => {
        let log = await result.wait()
        log = log.events[0]
        expect(log.event).to.equal('Withdraw')
        const event = { ...log.args }
        expect(event.token.toString()).to.equal(
          ETHER_ADDRESS,
          'token address is correct'
        )
        expect(event.user.toString()).to.equal(
          user1.address,
          'user address is correct'
        )
        expect(event.amount.toString()).to.equal(
          ether(1).toString(),
          'amount is correct'
        )
        expect(event.balance.toString()).to.equal('0', 'balance is correct')
      })
    })
    describe('failure', () => {
      it('rejects withdraws for insufficient funds', async () => {
        await expect(
          exchange.connect(user1).withdrawEther(ether(100), {
            value: amount,
          })
        ).to.be.reverted
      })
    })
  })

  describe('withdrawing tokens', () => {
    let result
    let amount

    describe('success', () => {
      beforeEach(async () => {
        amount = tokens(10)
        await token.connect(user1).approve(exchange.address, amount)
        await exchange.connect(user1).depositToken(token.address, amount)

        result = await exchange
          .connect(user1)
          .withdrawToken(token.address, amount)
      })

      it('tracks the token withdrawal', async () => {
        let balance
        balance = await exchange.tokens(token.address, user1.address)
        expect(balance.toString()).to.equal('0')
      })

      it('emits Token Deposit Event', async () => {
        let log = await result.wait()
        log = log.events[1]
        expect(log.event).to.equal('Withdraw')
        const event = { ...log.args }
        expect(event.token.toString()).to.equal(
          token.address,
          'token address is correct'
        )
        expect(event.user.toString()).to.equal(
          user1.address,
          'user address is correct'
        )
        expect(event.amount.toString()).to.equal(
          amount.toString(),
          'amount is correct'
        )
        expect(event.balance.toString()).to.equal('0', 'balance is correct')
      })
    })

    describe('failure', () => {
      amount = tokens(10)
      it('reject ether withdrawals', async () => {
        await expect(
          exchange.connect(user1).withdrawToken(ETHER_ADDRESS, amount)
        ).to.be.reverted
      })
      it('reject for insufficient balances', async () => {
        await expect(
          exchange.connect(user1).depositToken(token.address, amount)
        ).to.be.reverted
      })
    })
  })

  describe('checking balances', async () => {
    let amount
    beforeEach(async () => {
      amount = tokens(10)
      await exchange.connect(user1).depositEther({
        value: amount,
      })
    })

    it('returns user balance', async () => {
      const result = await exchange.balanceOf(ETHER_ADDRESS, user1.address)
      expect(result.toString()).to.equal(amount.toString())
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
      expect(order.id.toString()).to.equal('1', 'token address is correct')
      expect(order.user.toString()).to.equal(
        user1.address,
        'user address is correct'
      )
      expect(order.tokenGet.toString()).to.equal(
        token.address,
        'tokenGet is correct'
      )
      expect(order.amountGet.toString()).to.equal(
        amount.toString(),
        'amountGet is correct'
      )
      expect(order.tokenGive).to.equal(ETHER_ADDRESS, 'tokenGive is correct')
      expect(order.amountGive.toString()).to.equal(
        amount.toString(),
        'amountGive is correct'
      )
      expect(order.timestamp.toString()).length.to.be.at.least(
        1,
        'timestamp is correct'
      )
    })

    it('emits Order Event', async () => {
      let log = await result.wait()
      log = log.events[0]
      expect(log.event).to.equal('Order')
      const event = { ...log.args }
      expect(event.id.toString()).to.equal('1', 'token address is correct')
      expect(event.user.toString()).to.equal(
        user1.address,
        'user address is correct'
      )
      expect(event.tokenGet.toString()).to.equal(
        token.address,
        'tokenGet is correct'
      )
      expect(event.amountGet.toString()).to.equal(
        amount.toString(),
        'amountGet is correct'
      )
      expect(event.tokenGive).to.equal(ETHER_ADDRESS, 'tokenGive is correct')
      expect(event.amountGive.toString()).to.equal(
        amount.toString(),
        'amountGive is correct'
      )
      expect(event.timestamp.toString()).length.to.be.at.least(
        1,
        'timestamp is correct'
      )
    })
  })

  describe('order actions', async () => {
    let amount
    beforeEach(async () => {
      amount = ether(1)
      await exchange.connect(user1).depositEther({
        value: amount,
      })
      await token.transfer(user2.address, tokens(100))
      await token.connect(user2).approve(exchange.address, tokens(2))
      await exchange.connect(user2).depositToken(token.address, tokens(2))
      await exchange
        .connect(user1)
        .makeOrder(token.address, tokens(1), ETHER_ADDRESS, amount)
    })

    describe('filling orders', () => {
      let result
      describe('success', () => {
        beforeEach(async () => {
          result = await exchange.connect(user2).fillOrder('1')
        })

        it('executes the trade & charges fees', async () => {
          let balance
          balance = await exchange.balanceOf(token.address, user1.address)
          expect(balance.toString()).to.equal(
            tokens(1).toString(),
            'user1 received tokens'
          )
          balance = await exchange.balanceOf(ETHER_ADDRESS, user2.address)
          expect(balance.toString()).to.equal(
            tokens(1).toString(),
            'user2 received tokens'
          )
          balance = await exchange.balanceOf(ETHER_ADDRESS, user1.address)
          expect(balance.toString()).to.equal('0', 'user2 Ether deducted')
          balance = await exchange.balanceOf(token.address, user2.address)
          expect(balance.toString()).to.equal(
            tokens(0.9).toString(),
            'user2 tokens deducted with fee applied'
          )
          const feeAccount = await exchange.feeAccount()
          balance = await exchange.balanceOf(token.address, feeAccount)
          expect(balance.toString()).to.equal(
            tokens(0.1).toString(),
            'feeAccount received fee'
          )
        })

        it('updates filled orders', async () => {
          const orderFilled = await exchange.orderFilled(1)
          expect(orderFilled).to.equal(true)
        })

        it('emits Trade Event', async () => {
          let log = await result.wait()
          log = log.events[0]
          expect(log.event).to.equal('Trade')
          const event = { ...log.args }
          expect(event.id.toString()).to.equal('1', 'id is correct')
          expect(event.user.toString()).to.equal(
            user1.address,
            'user address is correct'
          )
          expect(event.tokenGet.toString()).to.equal(
            token.address,
            'tokenGet is correct'
          )
          expect(event.amountGet.toString()).to.equal(
            amount.toString(),
            'amountGet is correct'
          )
          expect(event.tokenGive).to.equal(
            ETHER_ADDRESS,
            'tokenGive is correct'
          )
          expect(event.amountGive.toString()).to.equal(
            amount.toString(),
            'amountGive is correct'
          )
          expect(event.timestamp.toString()).length.to.be.at.least(
            1,
            'timestamp is correct'
          )
        })
      })

      describe('failure', () => {
        it('rejects invalid order ids', async () => {
          const invalidOrderId = 9999
          await expect(exchange.connect(user1).fillOrder(invalidOrderId)).to.be
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
    })

    describe('cancelling orders', () => {
      let result
      describe('success', () => {
        beforeEach(async () => {
          result = await exchange.connect(user1).cancelOrder('1')
        })

        it('tracks the newly created order', async () => {
          const orderCancelled = await exchange.orderCancelled(1)
          expect(orderCancelled).to.equal(true)
        })

        it('emits Cancel Event', async () => {
          let log = await result.wait()
          log = log.events[0]
          expect(log.event).to.equal('Cancel')
          const event = { ...log.args }
          expect(event.id.toString()).to.equal('1', 'token address is correct')
          expect(event.user.toString()).to.equal(
            user1.address,
            'user address is correct'
          )
          expect(event.tokenGet.toString()).to.equal(
            token.address,
            'tokenGet is correct'
          )
          expect(event.amountGet.toString()).to.equal(
            amount.toString(),
            'amountGet is correct'
          )
          expect(event.tokenGive).to.equal(
            ETHER_ADDRESS,
            'tokenGive is correct'
          )
          expect(event.amountGive.toString()).to.equal(
            amount.toString(),
            'amountGive is correct'
          )
          expect(event.timestamp.toString()).length.to.be.at.least(
            1,
            'timestamp is correct'
          )
        })
      })

      describe('failure', () => {
        it('rejects invalid order ids', async () => {
          const invalidOrderId = 9999
          await expect(exchange.connect(user1).cancelOrder(invalidOrderId)).to
            .be.reverted
        })
        it('reject unauthorized cancellations', async () => {
          await expect(exchange.connect(user2).cancelOrder('1')).to.be.reverted
        })
      })
    })
  })
})
