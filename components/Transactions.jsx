function Transactions({
  myFilledOrders,
  myOpenOrders,
  cancelOrder,
  exchange,
  account,
}) {
  return (
    <div className="border-2 border-black">
      <div className="border-b-2 border-gray-900 p-4 text-xl">Transactions</div>

      <ul
        className="nav nav-tabs mb-4 flex list-none flex-col flex-wrap border-b-0 pl-0 md:flex-row"
        id="tabs-tab"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <a
            href="#tabs-trades"
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
            id="tabs-trades-tab"
            data-bs-toggle="pill"
            data-bs-target="#tabs-trades"
            role="tab"
            aria-controls="tabs-trades"
            aria-selected="true"
          >
            Trades
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            href="#tabs-orders"
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
            id="tabs-orders-tab"
            data-bs-toggle="pill"
            data-bs-target="#tabs-orders"
            role="tab"
            aria-controls="tabs-orders"
            aria-selected="false"
          >
            Orders
          </a>
        </li>
      </ul>
      <div className="tab-content" id="tabs-tabContent">
        <div
          className="active show tab-pane fade"
          id="tabs-trades"
          role="tabpanel"
          aria-labelledby="tabs-trades-tab"
        >
          <div className="w-full">
            <table className="w-full table-auto border-collapse text-center">
              <thead>
                <tr>
                  <th scope="col" className="border border-slate-700 py-2">
                    Time
                  </th>
                  <th scope="col" className="border border-slate-700 py-2">
                    DAPP
                  </th>
                  <th scope="col" className="border border-slate-700 py-2">
                    DAPP/ETH
                  </th>
                </tr>
              </thead>
              <tbody>
                {myFilledOrders.map((order) => {
                  return (
                    <tr key={order.id.toNumber() + order.timestamp.toNumber()}>
                      <th
                        scope="row"
                        className="border border-slate-700 py-1 font-normal text-gray-300"
                      >
                        {order.formattedTimestamp}
                      </th>
                      <td className="border border-slate-700 py-1">
                        {order.orderSign}
                        {order.tokenAmount}
                      </td>
                      <td className="border border-slate-700 py-1">
                        {order.tokenPrice}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="fade tab-pane"
          id="tabs-orders"
          role="tabpanel"
          aria-labelledby="tabs-orders-tab"
        >
          <div className="w-full">
            <table className="w-full table-auto border-collapse text-center">
              <thead>
                <tr>
                  <th scope="col" className="border border-slate-700 py-2">
                    Amount
                  </th>
                  <th scope="col" className="border border-slate-700 py-2">
                    DAPP/ETH
                  </th>
                  <th scope="col" className="border border-slate-700 py-2">
                    Cancel
                  </th>
                </tr>
              </thead>
              <tbody>
                {myOpenOrders.map((order) => {
                  return (
                    <tr key={order.id.toNumber() + order.timestamp.toNumber()}>
                      <th
                        scope="row"
                        className="border border-slate-700 py-1 font-normal text-gray-300"
                      >
                        {order.tokenAmount}
                      </th>
                      <td className="border border-slate-700 py-1">
                        {order.tokenPrice}
                      </td>
                      <td
                        className="border border-slate-700 py-1"
                        onClick={() => cancelOrder(exchange, order, account)}
                      >
                        X
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transactions
