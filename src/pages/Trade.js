import "../App.css"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ethers, BigNumber } from "ethers"
import NavBar from "../components/NavBar"
import myImage from "../img/green-bulb.png"
import {
    Divider,
    Grid,
    Image,
    Segment,
    Input,
    Button,
    Form,
    Card,
    Container,
} from "semantic-ui-react"

import EnergyTrade from "../artifacts/contracts/EnergyTrade.sol/EnergyTrade.json" //Import ABI Code to interact with smart contract

// const Energy_Trade_ContractAddress = "0x8B823D180e921BC95C576384EcD408D5e44f3dC7"
const Energy_Trade_ContractAddress = "0x21fF406C756247DA9D08599E762F75e7Af29A966"

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const ReadContracts = new ethers.Contract(Energy_Trade_ContractAddress, EnergyTrade.abi, provider)
const WriteContracts = new ethers.Contract(Energy_Trade_ContractAddress, EnergyTrade.abi, signer)

const Trade = () => {
    const { prosumerID } = useParams()
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([])
    const isConnected = Boolean(accounts[0])
    const [bidMessage, setBidMessage] = useState("")
    const [balance, setBalance] = useState({
        USDBalance: 0,
        MaticBalance: 0,
        StakedEnergy: 0,
    })
    const [inputValue, setInputValue] = useState(0)

    useEffect(() => {
        if (window.ethereum) {
            balanceOf()
        }
    }, [])

    const balanceOf = async () => {
        if (window.ethereum) {
            try {
                const usdBalance = await ReadContracts.producer_Set_Energy_Price_USD(
                    BigNumber.from(prosumerID)
                )
                const maticBalance = await ReadContracts.producer_Set_Energy_Price_Matic(
                    BigNumber.from(prosumerID)
                )
                const stakedEnergy = await ReadContracts.Staked_Energy_Balance(
                    BigNumber.from(prosumerID)
                )

                setBalance({
                    USDBalance: Number(usdBalance) / 1e18,
                    MaticBalance: Number(maticBalance) / 1e18,
                    StakedEnergy: Number(stakedEnergy),
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const Buy = async () => {
        if (window.ethereum) {
            try {
                setBidMessage("Transaction initiated...(please wait)")
                let inputWei = balance.MaticBalance * inputValue
                console.log("Bid Function Triggered...")
                const inputMatic = inputWei.toString()
                console.log(`InputMaticString: ${inputMatic}`)
                const Bid = await WriteContracts.bid(
                    BigNumber.from(prosumerID),
                    BigNumber.from(inputValue),
                    { value: ethers.utils.parseEther(inputMatic) }
                )
                await Bid.wait(1)
                setBidMessage(`Bidding successful with transaction hash ${Bid.hash}`)
                console.log(Bid)
            } catch (error) {
                console.log(error)
                setBidMessage(`Transaction Failed...Please Try Again`)
            }
        }
    }

    return (
        <div>
            <Segment>
                <Grid columns={2} relaxed="very">
                    <Grid.Column>
                        <h1>Prosumer ID: {prosumerID}</h1>
                    </Grid.Column>
                    <Grid.Column>
                        <h2>Buy Energy</h2>
                        <NavBar accounts={accounts} setAccounts={setAccounts} />
                    </Grid.Column>
                </Grid>
                <Divider vertical>P-2-P</Divider>
            </Segment>
            <Segment>
                <Card.Group style={{ marginLeft: "350px" }}>
                    <Card>
                        <Card.Content>
                            <Image floated="right" size="mini" src={myImage} />
                            <Card.Description>
                                <h4>Listed Energy:{balance.StakedEnergy}</h4>
                                <h5>Unit Price (USD):{balance.USDBalance} </h5>
                                <h5>Expected Matic Price:{balance.MaticBalance}</h5>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Form>
                                <Form.Field inline>
                                    <h5 style={{ marginBottom: "10px" }}>
                                        Enter Energy Unit you want to Buy
                                    </h5>
                                    <label style={{ marginRight: "10px" }}> Unit: </label>
                                    <Input
                                        placeholder="Enter Energy Unit"
                                        onChange={(e) => {
                                            setInputValue(e.target.value)
                                        }}
                                    />
                                    <h5>Total Matic Price: {balance.MaticBalance * inputValue} </h5>
                                    <p>Total USD Price: {balance.USDBalance * inputValue} </p>
                                </Form.Field>
                                <Button color="blue" onClick={Buy}>
                                    Buy
                                </Button>
                                <p style={{ color: "red" }}>{bidMessage}</p>
                            </Form>
                        </Card.Content>
                    </Card>
                </Card.Group>

                <Divider section />
                <Button
                    secondary
                    className="btn"
                    onClick={(e) => {
                        navigate("/")
                    }}
                >
                    Home
                </Button>
                <Button
                    color="brown"
                    className="btn"
                    onClick={(e) => {
                        navigate("/prosumer")
                    }}
                >
                    Prosumer
                </Button>
            </Segment>
        </div>
    )
}

export default Trade
