import "../App.css"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ethers, BigNumber } from "ethers"
import NavBar from "../components/NavBar"
import PublicRead from "../components/PublicRead"
import myImage from "../img/green-bulb.png"

import { Button, Card, Image, Grid, Segment, Divider } from "semantic-ui-react"

import EnergyTrade from "../artifacts/contracts/EnergyTrade.sol/EnergyTrade.json" //Import ABI Code to interact with smart contract
import EnergyHouse from "./EnergyHouse"

const Energy_Trade_ContractAddress = "0x8B823D180e921BC95C576384EcD408D5e44f3dC7"

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
const ReadContracts = new ethers.Contract(Energy_Trade_ContractAddress, EnergyTrade.abi, provider)
const WriteContracts = new ethers.Contract(Energy_Trade_ContractAddress, EnergyTrade.abi, signer)

const Prosumer = () => {
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([])
    const isConnected = Boolean(accounts[0])

    const [USDPrice, setUSDPrice] = useState({
        prosumer1: 0,
        prosumer2: 0,
        prosumer3: 0,
        prosumer4: 0,
    })
    const [MaticPrice, setMaticPrice] = useState({
        prosumer1: 0,
        prosumer2: 0,
        prosumer3: 0,
        prosumer4: 0,
    })
    const [StakeBalance, setStakeBalance] = useState({
        prosumer1: 0,
        prosumer2: 0,
        prosumer3: 0,
        prosumer4: 0,
    })

    /*

    producer_Set_Energy_Price_Matic
    producer_Set_Energy_Price_USD
    Staked_Energy_Balance

    */

    useEffect(() => {
        if (window.ethereum) {
            usdPrice()
            maticPrice()
            stakeBalance()
        }
    }, [])

    const usdPrice = async () => {
        if (window.ethereum) {
            try {
                const USDPrice1 = await ReadContracts.producer_Set_Energy_Price_USD(
                    BigNumber.from(1)
                )

                const USDPrice2 = await ReadContracts.producer_Set_Energy_Price_USD(
                    BigNumber.from(2)
                )

                const USDPrice3 = await ReadContracts.producer_Set_Energy_Price_USD(
                    BigNumber.from(3)
                )

                const USDPrice4 = await ReadContracts.producer_Set_Energy_Price_USD(
                    BigNumber.from(4)
                )

                setUSDPrice({
                    prosumer1: Number(USDPrice1) / 1e18,
                    prosumer2: Number(USDPrice2) / 1e18,
                    prosumer3: Number(USDPrice3) / 1e18,
                    prosumer4: Number(USDPrice4) / 1e18,
                })

                console.log(USDPrice.prosumer2)
            } catch (error) {
                console.log(error)
            }
        }
    }
    const stakeBalance = async () => {
        if (window.ethereum) {
            try {
                const StakeBalance1 = await ReadContracts.Staked_Energy_Balance(BigNumber.from(1))

                const StakeBalance2 = await ReadContracts.Staked_Energy_Balance(BigNumber.from(2))

                const StakeBalance3 = await ReadContracts.Staked_Energy_Balance(BigNumber.from(3))

                const StakeBalance4 = await ReadContracts.Staked_Energy_Balance(BigNumber.from(4))

                setStakeBalance({
                    prosumer1: Number(StakeBalance1),
                    prosumer2: Number(StakeBalance2),
                    prosumer3: Number(StakeBalance3),
                    prosumer4: Number(StakeBalance4),
                })

                console.log(`Stake Balance Prosumer 2 ${StakeBalance.prosumer2}`)
            } catch (error) {
                console.log(error)
            }
        }
    }
    const maticPrice = async () => {
        if (window.ethereum) {
            try {
                const MaticPrice1 = await ReadContracts.producer_Set_Energy_Price_Matic(
                    BigNumber.from(1)
                )

                const MaticPrice2 = await ReadContracts.producer_Set_Energy_Price_Matic(
                    BigNumber.from(2)
                )

                const MaticPrice3 = await ReadContracts.producer_Set_Energy_Price_Matic(
                    BigNumber.from(3)
                )

                const MaticPrice4 = await ReadContracts.producer_Set_Energy_Price_Matic(
                    BigNumber.from(4)
                )

                setMaticPrice({
                    prosumer1: Number(MaticPrice1) / 1e18,
                    prosumer2: Number(MaticPrice2) / 1e18,
                    prosumer3: Number(MaticPrice3) / 1e18,
                    prosumer4: Number(MaticPrice4) / 1e18,
                })

                console.log(`Matic Price Prosumer 2 ${MaticPrice.prosumer2}`)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div>
            <Segment>
                <Grid columns={2} relaxed="very">
                    <Grid.Column>
                        <PublicRead contract={ReadContracts} isConnected={isConnected} />
                    </Grid.Column>
                    <Grid.Column>
                        <h2>PROSUMER TRADING PAGE</h2>
                        <NavBar accounts={accounts} setAccounts={setAccounts} />
                    </Grid.Column>
                </Grid>

                <Divider vertical>P2P</Divider>
            </Segment>
            <Segment>
                <Card.Group>
                    <Card>
                        <Card.Content>
                            <Image floated="right" size="mini" src={myImage} />
                            <Card.Header>Prosumer Id: 1</Card.Header>
                            <Card.Description>
                                <h4>Listed Energy:{StakeBalance.prosumer1}</h4>
                                <h5>Unit Price (USD):{USDPrice.prosumer1} </h5>
                                <h5>Expected Matic Price:{MaticPrice.prosumer1}</h5>
                            </Card.Description>
                        </Card.Content>

                        <Card.Content extra>
                            <Button
                                as={Link}
                                to={`/prosumer/trade/1`}
                                className="ui inverted green button"
                            >
                                Buy
                            </Button>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Image floated="right" size="mini" src={myImage} />
                            <Card.Header>Prosumer Id: 2</Card.Header>
                            <Card.Description>
                                <h4>Listed Energy:{StakeBalance.prosumer2}</h4>
                                <h5>Unit Price (USD):{USDPrice.prosumer2} </h5>
                                <h5>Expected Matic Price:{MaticPrice.prosumer2}</h5>
                            </Card.Description>
                        </Card.Content>

                        <Card.Content extra>
                            <Button
                                as={Link}
                                to={`/prosumer/trade/2`}
                                className="ui inverted green button"
                            >
                                Buy
                            </Button>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Image floated="right" size="mini" src={myImage} />
                            <Card.Header>Prosumer Id: 3</Card.Header>
                            <Card.Description>
                                <h4>Listed Energy:{StakeBalance.prosumer3}</h4>
                                <h5>Unit Price (USD):{USDPrice.prosumer3} </h5>
                                <h5>Expected Matic Price:{MaticPrice.prosumer3}</h5>
                            </Card.Description>
                        </Card.Content>

                        <Card.Content extra>
                            <Button
                                as={Link}
                                to={`/prosumer/trade/3`}
                                className="ui inverted green button"
                            >
                                Buy
                            </Button>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Card.Content>
                            <Image floated="right" size="mini" src={myImage} />
                            <Card.Header>Prosumer Id: 4</Card.Header>
                            <Card.Description>
                                <h4>Listed Energy:{StakeBalance.prosumer4}</h4>
                                <h5>Unit Price (USD):{USDPrice.prosumer4} </h5>
                                <h5>Expected Matic Price:{MaticPrice.prosumer4}</h5>
                            </Card.Description>
                        </Card.Content>

                        <Card.Content extra>
                            <Button
                                as={Link}
                                to={`/prosumer/trade/4`}
                                className="ui inverted green button"
                            >
                                Buy
                            </Button>
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
                    color="green"
                    className="btn"
                    onClick={(e) => {
                        navigate("/prosumer/energyhouse")
                    }}
                >
                    My Energy House
                </Button>
            </Segment>
        </div>
    )
}

export default Prosumer
