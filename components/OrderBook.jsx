function OrderBook({ orderBook, fillOrder, exchange }) {
  return (
    <div className="row-span-6 border-2 border-black">
      <div className="border-b-2 border-gray-900 p-4 text-xl">OrderBook</div>
      <div className="w-full">
        <table className="w-full table-auto border-collapse text-center">
          <thead>
            <tr>
              <th scope="col" className="border border-slate-700 py-2">
                DAPP
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                DAPP/ETH
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                ETH
              </th>
            </tr>
          </thead>
          <tbody>
            {orderBook.sellOrders.map((order) => {
              return (
                <tr key={order.id.toNumber() + order.timestamp.toNumber()} onClick={
                  () => fillOrder(exchange, order)
                }>
                  <th
                    scope="row"
                    className="border border-slate-700 py-1 font-normal"
                  >
                    {order.tokenAmount}
                  </th>
                  <td className="border border-slate-700 py-1 text-red-500">
                    {order.tokenPrice}
                  </td>
                  <td className="border border-slate-700 py-1">
                    {order.etherAmount}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <table className="mt-4 w-full table-auto border-collapse text-center">
          <thead>
            <tr>
              <th scope="col" className="border border-slate-700 py-2">
                DAPP
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                DAPP/ETH
              </th>
              <th scope="col" className="border border-slate-700 py-2">
                ETH
              </th>
            </tr>
          </thead>
          <tbody>
            {orderBook.buyOrders.map((order) => {
              return (
                <tr key={order.id.toNumber() + order.timestamp.toNumber()} onClick={
                  () => fillOrder(exchange, order)
                }>
                  <th
                    scope="row"
                    className="border border-slate-700 py-1 font-normal"
                  >
                    {order.tokenAmount}
                  </th>
                  <td className="border border-slate-700 py-1 text-green-500">
                    {order.tokenPrice}
                  </td>
                  <td className="border border-slate-700 py-1">
                    {order.etherAmount}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrderBook
