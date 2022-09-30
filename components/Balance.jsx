import React, {useState} from "react"

function Balance({
  etherBalance,
  tokenBalance,
  exchangeEtherBalance,
  exchangeTokenBalance,
  depositEther,
  exchange,
  withdrawEther,
  depositToken,
  withdrawToken
}) {
  const [ethDepositValue, setEthDepositValue] = useState(0)
  const [ethWithdrawalValue, setEthWithdrawalValue] = useState(0)
  const [tokenDepositValue, setTokenDepositValue] = useState(0)
  const [tokenWithdrawalValue, setTokenWithdrawalValue] = useState(0)
  // Validate the inputs in the input fields using this function
  // having input type number looks ugly
  // const isNumber = (n) => {
  //   try {
  //     const num = parseFloat(n)
  //     return !isNaN(num)
  //   } catch (error) {
  //     console.log(`invalid input for n: ${n}`)
  //   }
  // }

  return (
    <div className="border-2 border-black">
      <div className="border-b-2 border-gray-900 p-4 text-xl">Balance</div>
      <div>
        <button className="cursor-pointer border-b-2 border-b-sky-700 p-4">
          Deposit
        </button>
        <button className="cursor-pointer p-4">Withdraw</button>
      </div>
      <div className="w-full">
        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr>
              <th scope="col" className="border border-slate-700 py-2">
                Token
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                Wallet
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                Exchange
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="border border-slate-700 py-1">
                ETH
              </th>
              <td className="border border-slate-700 py-1">{etherBalance}</td>
              <td className="border border-slate-700 py-1">{exchangeEtherBalance}</td>
            </tr>
          </tbody>
        </table>

        <div className="my-4 flex w-full justify-around px-2">
          <input
            className="rounded-lg bg-gray-700 p-2 focus:outline-none"
            type="number"
            name="ethAmount"
            placeholder="ETH Amount"
            onChange={e => setEthDepositValue(e.target.value)}
          />
          <button className="ml-2 rounded-lg bg-green-800 p-2" onClick={() => depositEther(exchange, ethDepositValue)}>Deposit</button>
        </div>

        <hr className="border border-slate-700" />

        <table className="mt-4 w-full table-auto border-collapse text-center">
          <thead>
            <tr>
              <th scope="col" className="border border-slate-700 py-2">
                Token
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                Wallet
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                Exchange
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="border border-slate-700 py-1">
                DAPP
              </th>
              <td className="border border-slate-700 py-1">{tokenBalance}</td>
              <td className="border border-slate-700 py-1">{exchangeTokenBalance}</td>
            </tr>
          </tbody>
        </table>

        <div className="my-4 flex w-full justify-around px-2">
          <input
            className="rounded-lg bg-gray-700 p-2 focus:outline-none"
            type="number"
            name="dappAmount"
            placeholder="DAPP Amount"
            onChange={e => setTokenDepositValue(e.target.value)}
          />
          <button className="ml-2 rounded-lg bg-green-800 p-2" onClick={() => depositToken(exchange, tokenDepositValue)}>Deposit</button>
        </div>

        {/* Withdrawal */}

        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr>
              <th scope="col" className="border border-slate-700 py-2">
                Token
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                Wallet
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                Exchange
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="border border-slate-700 py-1">
                ETH
              </th>
              <td className="border border-slate-700 py-1">{etherBalance}</td>
              <td className="border border-slate-700 py-1">{exchangeEtherBalance}</td>
            </tr>
          </tbody>
        </table>

        <div className="my-4 flex w-full justify-around px-2">
          <input
            className="rounded-lg bg-gray-700 p-2 focus:outline-none"
            type="number"
            name="ethAmount"
            placeholder="ETH Amount"
            onChange={e => setEthWithdrawalValue(e.target.value)}
          />
          <button className="ml-2 rounded-lg bg-green-800 p-2" onClick={() => withdrawEther(exchange, ethWithdrawalValue)}>Withdraw</button>
        </div>

        <hr className="border border-slate-700" />

        <table className="mt-4 w-full table-auto border-collapse text-center">
          <thead>
            <tr>
              <th scope="col" className="border border-slate-700 py-2">
                Token
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                Wallet
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                Exchange
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="border border-slate-700 py-1">
                DAPP
              </th>
              <td className="border border-slate-700 py-1">{tokenBalance}</td>
              <td className="border border-slate-700 py-1">{exchangeTokenBalance}</td>
            </tr>
          </tbody>
        </table>

        <div className="my-4 flex w-full justify-around px-2">
          <input
            className="rounded-lg bg-gray-700 p-2 focus:outline-none"
            type="number"
            name="dappAmount"
            placeholder="DAPP Amount"
            onChange={e => setTokenWithdrawalValue(e.target.value)}
          />
          <button className="ml-2 rounded-lg bg-green-800 p-2" onClick={() => withdrawToken(exchange, tokenWithdrawalValue)}>Withdraw</button>
        </div>
      </div>
    </div>
  )
}

export default Balance
