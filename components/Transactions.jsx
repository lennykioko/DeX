function Transactions({ myFilledOrders, myOpenOrders, cancelOrder, exchange, account }) {
  return (
    <div className="border-2 border-black">
      <div className="border-b-2 border-gray-900 p-4 text-xl">Transactions</div>
      <div>
        <button className="cursor-pointer border-b-2 border-b-sky-700 p-4">
          Trades
        </button>
        <button className="cursor-pointer p-4">Orders</button>
      </div>

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
            {/* {myFilledOrders.map((order) => {
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
            })} */}
          </tbody>
        </table>
      </div>

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
            {/* {myOpenOrders.map((order) => {
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
                  <td className="border border-slate-700 py-1" onClick={
                    () => cancelOrder(exchange, order, account)
                  }>X</td>
                </tr>
              )
            })} */}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Transactions
