import "./App.css"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Prosumer from "./pages/Prosumer"
import Escrow from "./pages/Escrow"
import EnergyHouse from "./pages/EnergyHouse"
import Trade from "./pages/Trade"

function App() {
    return (
        <div className="App">
            <h1>P-2-P Energy Trading using Blockchain</h1>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="prosumer" element={<Prosumer />} />
                    <Route path="escrow" element={<Escrow />} />
                    <Route path="/prosumer/energyhouse" element={<EnergyHouse />} />
                    <Route path="/prosumer/trade/:prosumerID" element={<Trade />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
