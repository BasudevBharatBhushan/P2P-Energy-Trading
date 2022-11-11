import "../App.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ethers, BigNumber } from "ethers"
import NavBar from "../components/NavBar"
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
const Energy_Trade_ContractAddress = "0x21fF406C756247DA9D08599E762F75e7Af29A966

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const ReadContracts = new ethers.Contract(Energy_Trade_ContractAddress, EnergyTrade.abi, provider)
const WriteContracts = new ethers.Contract(Energy_Trade_ContractAddress, EnergyTrade.abi, signer)

const EnergyHouse = () => {
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([])
    const isConnected = Boolean(accounts[0])

    const [energyBalance, setEnergyBalance] = useState(0)
    const [prosumerID, setProsumerID] = useState(0)
    const [StakedEnergyBalance, setStakedEnergyBalance] = useState(0)
    const [energyValue, setEnergyValue] = useState(0)
    const [energyInputPrice, setEnergyInputPrice] = useState(0)
    const [MaticPrice, setMaticPrice] = useState(0)
    const [USDPrice, setUSDPrice] = useState(0)
    const [mintMessage, setMintMessage] = useState("")
    const [burnMessage, setBurnMessage] = useState("")

    useEffect(() => {
        if (window.ethereum) {
            balanceOf()
        }
    }, [])

    const balanceOf = async () => {
        if (window.ethereum) {
            try {
                const ProsumerID = await ReadContracts.prosumerID(signer.getAddress())
                setProsumerID(Number(ProsumerID))
                const BalanceOf = await ReadContracts.balanceOf(signer.getAddress())
                const StakedEnergyBalance = await ReadContracts.Staked_Energy_Balance(
                    BigNumber.from(prosumerID)
                )
                const maticPrice = await WriteContracts.mySetUnitPrice_Matic()
                const usdPrice = await WriteContracts.mySetUnitPrice_USD()

                console.log(Number(BalanceOf))
                setEnergyBalance(Number(BalanceOf))
                setStakedEnergyBalance(Number(StakedEnergyBalance))

                let inputMaticPrice = Number(maticPrice)
                inputMaticPrice /= 1e18
                let inputUSDPrice = Number(usdPrice)
                inputUSDPrice /= 1e18
                setMaticPrice(inputMaticPrice)
                setUSDPrice(inputUSDPrice)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const mint = async () => {
        if (window.ethereum) {
            try {
                setMintMessage("Minting in progress...Please Wait")
                const Mint = await WriteContracts.produceEnergy(BigNumber.from(energyValue))
                await Mint.wait(1)
                console.log(Mint)
                setEnergyValue(0)
                setMintMessage("Minting Successfull")
                refresh()
            } catch (error) {
                console.log(error)
                setMintMessage("Minting Failed")
            }
        }
    }

    const burn = async () => {
        if (window.ethereum) {
            try {
                setBurnMessage("Burning in progress...Please Wait")
                const Burn = await WriteContracts.burnEnergy(BigNumber.from(energyValue))
                await Burn.wait(1)
                console.log(Burn)
                setEnergyValue(0)
                setBurnMessage("Burning Successfull")
                refresh()
            } catch (error) {
                console.log(error)
                setBurnMessage("Burning Failed")
            }
        }
    }

    const list = async () => {
        if (window.ethereum) {
            try {
                console.log("List Button Triggered...")
                console.log(`Entered Input Price ${energyInputPrice}`)
                const inputValue = energyInputPrice * 1e18
                console.log(inputValue)
                const List = await WriteContracts.advert(
                    BigNumber.from(inputValue),
                    BigNumber.from(energyValue)
                )
                await List.wait(1)
                console.log(List)
                setEnergyValue(0)
                refresh()
            } catch (error) {
                console.log(error)
            }
        }
    }

    const refresh = () => {
        navigate("/prosumer/energyhouse")
    }

    return (
        <div>
            {/* <button onClick={refresh}>REFRESH</button> */}
            <Segment>
                <Grid columns={2} relaxed="very">
                    <Grid.Column>
                        <h4 style={{ color: "red" }}>Energy Balance: {energyBalance}</h4>
                        <h4 style={{ color: "red" }}>
                            Staked Energy Balance: {StakedEnergyBalance}
                        </h4>
                    </Grid.Column>
                    <Grid.Column>
                        <h2>Energy House</h2>
                        <NavBar accounts={accounts} setAccounts={setAccounts} />
                        <h4 style={{ color: "red" }}>Prosumer Id: {prosumerID}</h4>
                    </Grid.Column>
                </Grid>

                <Divider vertical>Prosumer</Divider>
            </Segment>

            <segment>
                <Grid columns={2} relaxed="very">
                    <Grid.Column>
                        <Form>
                            <Form.Field inline>
                                <h4 style={{ marginBottom: "10px" }}>Energy Meter</h4>
                                <label style={{ marginRight: "5px" }}>Produce Energy </label>
                                <Input
                                    placeholder="Unit of Energy "
                                    onChange={(e) => {
                                        setEnergyValue(e.target.value)
                                    }}
                                />
                                <Button positive style={{ marginLeft: "10px" }} onClick={mint}>
                                    Mint
                                </Button>
                                <p>{mintMessage}</p>
                            </Form.Field>
                            <Form.Field inline>
                                <label>Burn Energy </label>
                                <Input
                                    placeholder="Unit of Energy"
                                    onChange={(e) => {
                                        setEnergyValue(e.target.value)
                                    }}
                                />
                                <Button color="red" style={{ marginLeft: "10px" }} onClick={burn}>
                                    Burn
                                </Button>
                                <p>{burnMessage}</p>
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        <div>
                            <Form>
                                <Form.Field inline>
                                    <h4 style={{ marginBottom: "10px" }}>List Your Energy</h4>
                                    <label style={{ marginRight: "5px" }}>Energy Unit </label>
                                    <Input
                                        placeholder="Unit of Energy for Listing"
                                        onChange={(e) => {
                                            setEnergyValue(e.target.value)
                                        }}
                                    />
                                </Form.Field>
                                <Form.Field inline>
                                    <label>Price(USD) </label>
                                    <Input
                                        placeholder="Price for 1 Unit"
                                        onChange={(e) => {
                                            setEnergyInputPrice(e.target.value)
                                        }}
                                    />
                                </Form.Field>
                                <Button color="blue" onClick={list}>
                                    List
                                </Button>
                            </Form>
                        </div>
                    </Grid.Column>
                </Grid>

                <Divider horizontal>---</Divider>
                <div style={{ marginLeft: "540px" }}>
                    <Card>
                        <Card.Header>Listed Energy</Card.Header>
                        <Card.Content>
                            <h4>Prosumer ID: {prosumerID}</h4>
                            Unit Price(USD): {USDPrice}
                            <Card.Meta>Unit Price(Matic):{MaticPrice}</Card.Meta>
                        </Card.Content>
                    </Card>
                </div>
                <Divider horizontal>---</Divider>
            </segment>
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
        </div>
    )
}
export default EnergyHouse
