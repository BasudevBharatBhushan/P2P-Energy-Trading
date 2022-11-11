import { useEffect } from "react"

const NavBar = ({ accounts, setAccounts }) => {
    const isConnected = Boolean(accounts[0])

    useEffect(() => {
        connectAccount()
    }, [])

    async function connectAccount() {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            })
            setAccounts(accounts)
        }
    }
    return (
        <div>
            {isConnected ? (
                <h3 style={{ color: "#1DB954" }}>Metamask Connected</h3>
            ) : (
                <button onClick={connectAccount}>Connect Wallet</button>
            )}
        </div>
    )
}

export default NavBar
