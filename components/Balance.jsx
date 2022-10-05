import React, { useState } from 'react'

function Balance({
  etherBalance,
  tokenBalance,
  exchangeEtherBalance,
  exchangeTokenBalance,
  depositEther,
  exchange,
  withdrawEther,
  depositToken,
  withdrawToken,
}) {
  const [ethDepositValue, setEthDepositValue] = useState(0)
  const [ethWithdrawalValue, setEthWithdrawalValue] = useState(0)
  const [tokenDepositValue, setTokenDepositValue] = useState(0)
  const [tokenWithdrawalValue, setTokenWithdrawalValue] = useState(0)

  return (
    <div className="border-2 border-black">
      <ul
        className="nav nav-tabs mb-4 flex list-none flex-col flex-wrap border-b-0 pl-0 md:flex-row"
        id="tabs-tab"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <a
            href="#tabs-home"
            className="
            nav-link
            active
            my-2
            block
            border-x-0 border-t-0 border-b-2 border-transparent
            px-6
            py-3
            uppercase
            leading-tight hover:border-transparent
            hover:bg-gray-100
            focus:border-b-sky-700
          "
            id="tabs-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#tabs-home"
            role="tab"
            aria-controls="tabs-home"
            aria-selected="true"
          >
            Deposit
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            href="#tabs-profile"
            className="
            nav-link
            my-2
            block
            border-x-0
            border-t-0
            border-b-2 border-transparent px-6 py-3
            font-medium
            uppercase
            leading-tight
            hover:border-transparent hover:bg-gray-100
            focus:border-transparent
          "
            id="tabs-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#tabs-profile"
            role="tab"
            aria-controls="tabs-profile"
            aria-selected="false"
          >
            Withdraw
          </a>
        </li>
      </ul>
      <div className="tab-content" id="tabs-tabContent">
        <div
          className="active tab-pane show fade"
          id="tabs-home"
          role="tabpanel"
          aria-labelledby="tabs-home-tab"
        >
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
                <td className="border border-slate-700 py-1">
                  {exchangeEtherBalance}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="my-4 flex w-full justify-around px-2">
            <input
              className="rounded-lg bg-gray-700 p-2 focus:outline-none"
              type="number"
              name="ethAmount"
              placeholder="ETH Amount"
              onChange={(e) => setEthDepositValue(e.target.value)}
              min={0}
            />
            <button
              className="ml-2 rounded-lg bg-green-800 p-2"
              onClick={() => depositEther(exchange, ethDepositValue)}
            >
              Deposit
            </button>
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
                <td className="border border-slate-700 py-1">
                  {exchangeTokenBalance}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="my-4 flex w-full justify-around px-2">
            <input
              className="rounded-lg bg-gray-700 p-2 focus:outline-none"
              type="number"
              name="dappAmount"
              placeholder="DAPP Amount"
              onChange={(e) => setTokenDepositValue(e.target.value)}
              min={0}
            />
            <button
              className="ml-2 rounded-lg bg-green-800 p-2"
              onClick={() => depositToken(exchange, tokenDepositValue)}
            >
              Deposit
            </button>
          </div>
        </div>
        <div
          className="fade tab-pane"
          id="tabs-profile"
          role="tabpanel"
          aria-labelledby="tabs-profile-tab"
        >
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
                <td className="border border-slate-700 py-1">
                  {exchangeEtherBalance}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="my-4 flex w-full justify-around px-2">
            <input
              className="rounded-lg bg-gray-700 p-2 focus:outline-none"
              type="number"
              name="ethAmount"
              placeholder="ETH Amount"
              onChange={(e) => setEthWithdrawalValue(e.target.value)}
              min={0}
            />
            <button
              className="ml-2 rounded-lg bg-green-800 p-2"
              onClick={() => withdrawEther(exchange, ethWithdrawalValue)}
            >
              Withdraw
            </button>
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
                <td className="border border-slate-700 py-1">
                  {exchangeTokenBalance}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="my-4 flex w-full justify-around px-2">
            <input
              className="rounded-lg bg-gray-700 p-2 focus:outline-none"
              type="number"
              name="dappAmount"
              placeholder="DAPP Amount"
              onChange={(e) => setTokenWithdrawalValue(e.target.value)}
              min={0}
            />
            <button
              className="ml-2 rounded-lg bg-green-800 p-2"
              onClick={() => withdrawToken(exchange, tokenWithdrawalValue)}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Balance
