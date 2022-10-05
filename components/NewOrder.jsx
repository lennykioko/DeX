import React, { useState } from 'react'

function NewOrder({
  makeBuyOrder, makeSellOrder, exchange
}) {
  const [buyOrder, setBuyOrder] = useState({
    amount: 0,
    price: 0
  })
  const [sellOrder, setSellOrder] = useState({
    amount: 0,
    price: 0
  })

  // need to set state for buy or sell and toggle the names and color of buttons on toggle
  return (
    <div className="border-2 border-black">
      <div className="border-b-2 border-gray-900 p-4 text-xl">NewOrder</div>
      <ul
        className="nav nav-tabs mb-4 flex list-none flex-col flex-wrap border-b-0 pl-0 md:flex-row"
        id="tabs-tab"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <a
            href="#tabs-buy"
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
            id="tabs-buy-tab"
            data-bs-toggle="pill"
            data-bs-target="#tabs-buy"
            role="tab"
            aria-controls="tabs-buy"
            aria-selected="true"
          >
            Buy
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            href="#tabs-sell"
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
            id="tabs-sell-tab"
            data-bs-toggle="pill"
            data-bs-target="#tabs-sell"
            role="tab"
            aria-controls="tabs-sell"
            aria-selected="false"
          >
            Sell
          </a>
        </li>
      </ul>
      <div className="tab-content" id="tabs-tabContent">
        <div
          className="active show tab-pane fade"
          id="tabs-buy"
          role="tabpanel"
          aria-labelledby="tabs-buy-tab"
        >
          <div className="flex-col p-4">
            <label htmlFor="buyAmount">Buy Amount (DAPP)</label>
            <input
              className="my-2 block rounded-lg bg-gray-700 p-2 focus:outline-none"
              type="number"
              name="buyAmount"
              id="buyAmount"
              placeholder="Buy Amount"
              onChange={(event) => setBuyOrder({...buyOrder, amount: Number(event.target.value) })}
            />

            <label htmlFor="buyPrice">Buy Price</label>
            <input
              className="my-2 block rounded-lg bg-gray-700 p-2 focus:outline-none"
              type="number"
              name="buyPrice"
              id="buyPrice"
              placeholder="Buy Price"
              onChange={(event) => setBuyOrder({...buyOrder, price: Number(event.target.value) })}
            />
            <button className="ml-2 rounded-lg bg-green-800 p-2" onClick={() => makeBuyOrder(exchange, buyOrder)}>
              Buy Order
            </button>
            <p>Total: {buyOrder.amount * buyOrder.price} ETH</p>
          </div>
        </div>
        <div
          className="fade tab-pane"
          id="tabs-sell"
          role="tabpanel"
          aria-labelledby="tabs-sell-tab"
        >
          <div className="flex-col p-4">
            <label htmlFor="sellAmount">Sell Amount (DAPP)</label>
            <input
              className="my-2 block rounded-lg bg-gray-700 p-2 focus:outline-none"
              type="number"
              name="sellAmount"
              id="sellAmount"
              placeholder="Sell Amount"
              onChange={(event) => setSellOrder({...sellOrder, amount: Number(event.target.value) })}
            />

            <label htmlFor="sellPrice">Sell Price</label>
            <input
              className="my-2 block rounded-lg bg-gray-700 p-2 focus:outline-none"
              type="number"
              name="sellPrice"
              id="sellPrice"
              placeholder="Sell Price"
              onChange={(event) => setSellOrder({...sellOrder, price: Number(event.target.value) })}
            />
            <button className="ml-2 rounded-lg bg-green-800 p-2" onClick={() => makeSellOrder(exchange, sellOrder)}>
              Sell Order
            </button>
            <p>Total: {sellOrder.amount * sellOrder.price} ETH</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewOrder
