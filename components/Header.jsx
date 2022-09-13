import { useState, useEffect } from 'react'

const Header = ({ address }) => {
  const [displayAddress, setDisplayAddress] = useState('')
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 760)

    if (isMobile) {
      address &&
        setDisplayAddress(`${address.slice(0, 4)}...${address.slice(38)}`)
    } else {
      address && setDisplayAddress(address)
    }
  }, [isMobile, address])

  return (
    <div className="flex items-center justify-between border-2 border-black bg-sky-900 p-4">
      <div className="text-xl">
        <a href="#!">
          DApp Token Exchange
        </a>
      </div>
      <div className=" text-gray-300">
        <a
          href={`https://etherscan.io/address/${displayAddress}`}
          className="className"
          target="_blank"
          rel="noreferrer"
        >
          {displayAddress}
        </a>
      </div>
    </div>
  )
}

export default Header
