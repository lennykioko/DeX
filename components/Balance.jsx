function Balance() {
  // Validate the inputs in the input fields using this function
  // having input type number looks ugly
  const isNumber = (n) => {
    try {
      const num = parseFloat(n)
      return !isNaN(num)
    } catch (error) {
      console.log(`invalid input for n: ${n}`)
    }
  }

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
              <td className="border border-slate-700 py-1">0.84</td>
              <td className="border border-slate-700 py-1">1.74</td>
            </tr>
          </tbody>
        </table>

        <div className="my-4 flex w-full justify-around px-2">
          <input
            className="rounded-lg bg-gray-700 p-2 focus:outline-none"
            type="text"
            name="ethAmount"
            placeholder="ETH Amount"
          />
          <button className="ml-2 rounded-lg bg-green-800 p-2">Deposit</button>
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
              <td className="border border-slate-700 py-1">980000</td>
              <td className="border border-slate-700 py-1">350.03</td>
            </tr>
          </tbody>
        </table>

        <div className="my-4 flex w-full justify-around px-2">
          <input
            className="rounded-lg bg-gray-700 p-2 focus:outline-none"
            type="text"
            name="dappAmount"
            placeholder="DAPP Amount"
          />
          <button className="ml-2 rounded-lg bg-green-800 p-2">Deposit</button>
        </div>
      </div>
    </div>
  )
}

export default Balance
