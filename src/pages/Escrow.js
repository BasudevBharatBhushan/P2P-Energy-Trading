import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import NavBar from "../components/NavBar"
import { Divider, Grid, Image, Segment, Input, Button } from "semantic-ui-react"

import PluggNFT from "../artifacts/contracts/EnergyTrade.sol/EnergyTrade.json" //Import ABI Code to interact with smart contract

const Energy_Trade_ContractAddress = "0x8B823D180e921BC95C576384EcD408D5e44f3dC7"

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const ReadContracts = new ethers.Contract(Energy_Trade_ContractAddress, PluggNFT.abi, provider)
const WriteContracts = new ethers.Contract(Energy_Trade_ContractAddress, PluggNFT.abi, signer)

/*
Add Prosumer
Remove Prosumer

TradeStatus
WithdrawFunds
View Escrow Balance

*/

const Escrow = () => {
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([])
    const isConnected = Boolean(accounts[0])

    const [trade_status, setTrade_status] = useState(false)
    const [prosumer, setProsumer] = useState("")
    const [prosumerMessage, setProsumerMessage] = useState("")
    const [escrow_balance, setEscrow_balance] = useState({
        MaticBalance: undefined,
        EnergyBalance: undefined,
    })
    const [tradeMessage, setTradeMessage] = useState("")

    useEffect(() => {
        if (window.ethereum) {
            tradeStatus()
            escrowBalance()
        }
    }, [])

    const addProsumer = async () => {
        setProsumerMessage("Adding Prosumer...(Please Wait)")
        console.log("Adding Prosumer...")
        if (window.ethereum) {
            try {
                console.log(prosumer)
                const AddProsumer = await WriteContracts.addProsumer(prosumer)
                await AddProsumer.wait(1)

                const ProsumerID = await ReadContracts.prosumerCounter()
                setProsumerMessage(
                    `Prosumer successfully Registered with Prosumer ID: ${ProsumerID}`
                )
                console.log(`Transaction Hash: ${AddProsumer.hash}`)
            } catch (error) {
                console.log(error)
                setProsumerMessage(`Sender is not Owner`)
            }
        }
    }

    const removeProsumer = async () => {
        setProsumerMessage("Removing Prosumer....")
        console.log("Removing Prosumer...")
        if (window.ethereum) {
            try {
                const ProsumerID = await ReadContracts.prosumerCounter()
                const RemoveProsumer = await WriteContracts.removeProsumer()
                await RemoveProsumer.wait(1)
                setProsumerMessage(`Last Prosumer successfully Removed Prosumer ID: ${ProsumerID}`)
            } catch (error) {
                setProsumerMessage(`Sender is not Owners`)
            }
        }
    }

    const tradeStatus = async () => {
        if (window.ethereum) {
            try {
                const TradeStatus = await WriteContracts.tradeStatus()
                setTrade_status(TradeStatus)
                console.log("Trade Status: ", TradeStatus)
            } catch (error) {
                console.log("Trade Status Error: ", error)
            }
        }
    }

    const escrowBalance = async () => {
        if (window.ethereum) {
            try {
                const EscrowBalance = await ReadContracts.viewEscrowBalance()
                setEscrow_balance({
                    MaticBalance: Number(EscrowBalance[0]),
                    EnergyBalance: Number(EscrowBalance[1]),
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const executeTrade = async () => {
        setTradeMessage("")
        if (window.ethereum) {
            try {
                const ExecuteTrade = await WriteContracts.withdrawFunds()
                setTradeMessage(
                    `Trade successfully executed with Transaction Hash: ${ExecuteTrade.hash}`
                )
            } catch (error) {
                setTradeMessage(`Unable to Execute Trade`)
                console.log(error)
            }
        }
    }

    return (
        <div>
            <Segment>
                <Grid columns={2} relaxed="very">
                    <Grid.Column>
                        <div>
                            <h4>Escrow Balance</h4>
                            <p style={{ color: "brown" }}>
                                Matic Balance: {escrow_balance.MaticBalance}
                            </p>
                            <p style={{ color: "blue" }}>
                                Energy Balance: {escrow_balance.EnergyBalance}
                            </p>
                        </div>
                    </Grid.Column>
                    <Grid.Column>
                        <h3 style={trade_status ? { color: "green" } : { color: "red" }}>
                            Trade Status: {trade_status ? "Positive" : "Negative"}
                        </h3>
                    </Grid.Column>
                </Grid>

                <Divider vertical>Escrow Page</Divider>
            </Segment>

            <Segment basic textAlign="center">
                <NavBar accounts={accounts} setAccounts={setAccounts} />
                <Divider horizontal>---------</Divider>

                <div>
                    <h3>Add/Remove Prosumer</h3>
                    <input
                        placeholder="Enter the Wallet Address"
                        onChange={(e) => {
                            setProsumer(e.target.value)
                        }}
                    />
                    <button onClick={addProsumer}>Add Prosumer</button>
                    <button className="btn" onClick={removeProsumer}>
                        Remove Recently Added Prosumer
                    </button>
                    <p style={{ color: "red" }}>{prosumerMessage}</p>
                </div>
                <Divider horizontal>---------</Divider>
                <h3>Execute Trade (Only Possible by Escrow)</h3>
                <Button inverted color="red" onClick={executeTrade}>
                    Execute Trade
                </Button>
                <p style={{ color: "red" }}>{tradeMessage}</p>
                <Divider horizontal>---------</Divider>
                <Button
                    secondary
                    className="btn"
                    onClick={(e) => {
                        navigate("/")
                    }}
                >
                    Home
                </Button>
            </Segment>
        </div>
    )
}

export default Escrow
