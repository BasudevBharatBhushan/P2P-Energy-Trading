import "../App.css"
import { useState, useEffect } from "react"
import { BigNumber } from "ethers"

import { Divider, Image, Segment } from "semantic-ui-react"

const PublicRead = ({ contract, isConnected }) => {
    const [owners, setOwners] = useState({
        contractOwner: "",
        escrowAccount: "",
    })
    const [prosumer_counter, setProsumer_counter] = useState()

    /***********PUBLIC VARIABLES*****************/
    /*
    uint256 public prosumerCounter;
    address public owner;
    address public escrowAccount; 

    mapping(uint256 => address) public prosumerAddress;
    mapping(address => uint256) public prosumerID;


*/

    useEffect(() => {
        if (window.ethereum) {
            showContractOwner()
            prosumerCounter()
        }
    }, [])

    const showContractOwner = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const contractOwner = await contract.owner()
                const escrowAccount = await contract.escrowAccount()
                setOwners({ contractOwner, escrowAccount })
            } catch (error) {
                console.log("Error:", error)
            }
        }
    }

    const prosumerCounter = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const ProsumerCounter = await contract.prosumerCounter()
                setProsumer_counter(Number(ProsumerCounter))
            } catch (error) {
                console.log(error)
            }
        }
    }

    const prosumerDetails = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const ProsumerDetails = await contract.prosumerAddress(BigNumber.from(1))

                console.log(ProsumerDetails)
                //TODO: Loop through the Prosume details and show all the prosumer in the network
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div>
            <Segment inverted>
                <h4>Contract Maker: {owners.contractOwner}</h4>
                <h4>Escrow Account: {owners.escrowAccount}</h4>
                <Divider inverted />

                <h3>No. of Prosumers Registered: {prosumer_counter}</h3>
            </Segment>
        </div>
    )
}

export default PublicRead
