import React from "react"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()

    return (
        <div>
            <h1>Home</h1>
            <button
                className="ui primary button"
                onClick={(e) => {
                    navigate("/Prosumer")
                }}
            >
                Prosumer Page
            </button>

            <button
                className="ui secondary button"
                onClick={(e) => {
                    navigate("/Escrow")
                }}
            >
                Escrow Page
            </button>
        </div>
    )
}

export default Home
