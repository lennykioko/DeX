// TO DO IS MAKE IT RUN FROM DEPLOYED CONTRACTS
const { tokens, ether, ETHER_ADDRESS } = require('./helper')
const hre = require('hardhat')
const ethers = hre.ethers

const wait = (sec) => {
  const millisec = sec * 1000
  return new Promise((resolve) => setTimeout(resolve, millisec))
}

async function main() {
  const [account1, account2, account3] = await ethers.getSigners()

  // We get the contract to deploy
  const Token = await hre.ethers.getContractFactory('Token')
  const token = await Token.deploy()
  await token.deployed()

  console.log('Token deployed', token.address)

  // We get the contract to deploy
  const Exchange = await hre.ethers.getContractFactory('Exchange')
  const exchange = await Exchange.deploy(account3.address, 10)
  await exchange.deployed()
  console.log('Exchange deployed', token.address)

  await token.transfer(account2.address, tokens(100))
  console.log(
    `token transffered from ${account1.address} to ${account2.address}`
  )

  await exchange.depositEther({ value: ether(30) })

  console.log(
    `Ether deposited to exchnage from ${account1.address} to ${exchange.address}`
  )

  await token.connect(account2).approve(exchange.address, tokens(50))
  console.log(`Token approved from ${account2.address} to ${exchange.address}`)

  await exchange.connect(account2).depositToken(token.address, tokens(50))
  console.log(
    `Token deposited to exchnage from ${account2.address} to ${exchange.address}`
  )

  let result = await exchange.makeOrder(
    token.address,
    tokens(2),
    ETHER_ADDRESS,
    ether(0.015)
  )
  console.log(`order made by ${account1.address}`)

  let num = await result.wait()

  let orderId = num.events[0].args[0].toNumber()

  console.log(orderId)

  await exchange.cancelOrder(orderId)
  console.log(`order cancelled by ${account1.address}`)
  await wait(2)

  // filling order 1
  result = await exchange.makeOrder(
    token.address,
    tokens(2),
    ETHER_ADDRESS,
    ether(0.015)
  )
  console.log(`order made by ${account1.address}`)

  num = await result.wait()

  orderId = num.events[0].args[0].toNumber()
  console.log(orderId)

  await exchange.connect(account2).fillOrder(orderId)
  console.log(`order filled by  ${account2.address}`)
  await wait(2)

  // filling order 2
  result = await exchange.makeOrder(
    token.address,
    tokens(1.9),
    ETHER_ADDRESS,
    ether(0.011)
  )
  console.log(`order made by ${account1.address}`)

  num = await result.wait()

  orderId = num.events[0].args[0].toNumber()

  await exchange.connect(account2).fillOrder(orderId)
  console.log(`order filled by  ${account2.address}`)

  await wait(2)

  // filling order 3
  result = await exchange.makeOrder(
    token.address,
    tokens(1),
    ETHER_ADDRESS,
    ether(0.005)
  )
  console.log(`order made by ${account1.address}`)

  num = await result.wait()

  orderId = num.events[0].args[0].toNumber()

  await exchange.connect(account2).fillOrder(orderId)
  console.log(`order filled by  ${account2.address}`)

  await wait(2)

  // account 1 makes 10 orders

  for (let i = 1; i <= 11; i++) {
    let amountToBuy = tokens(1 * i)
    await exchange.makeOrder(
      token.address,
      amountToBuy,
      ETHER_ADDRESS,
      ether(0.001 * i)
    )
    console.log(`order made by ${account1.address}`)
    await wait(2)
  }

  // account 2 makes 10 orders
  for (let i = 1; i <= 11; i++) {
    let amountToBuy = tokens(1 * i)
    await exchange
      .connect(account2)
      .makeOrder(ETHER_ADDRESS, amountToBuy, token.address, tokens(0.1 * i))
    console.log(`order made by ${account2.address}`)
    await wait(2)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
