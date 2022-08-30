function NewOrder() {
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

  // need to set state for buy or sell and toggle the names and color of buttons on toggle
  return (
    <div className="border-2 border-black">
      <div className="border-b-2 border-gray-900 p-4 text-xl">NewOrder</div>
      <div>
        <button className="cursor-pointer border-b-2 border-b-sky-700 p-4">
          Buy
        </button>
        <button className="cursor-pointer p-4">Sell</button>
      </div>
      <div className="flex-col p-4">
        <label htmlFor="buyAmount">Buy Amount (DAPP)</label>
        <input
          className="my-2 block rounded-lg bg-gray-700 p-2 focus:outline-none"
          type="text"
          name="buyAmount"
          id="buyAmount"
          placeholder="Buy Amount"
        />

        <label htmlFor="buyPrice">Buy Price</label>
        <input
          className="my-2 block rounded-lg bg-gray-700 p-2 focus:outline-none"
          type="text"
          name="buyPrice"
          id="buyPrice"
          placeholder="Buy Price"
        />
        <button className="ml-2 rounded-lg bg-green-800 p-2">Buy Order</button>
      </div>
    </div>
  )
}

export default NewOrder
