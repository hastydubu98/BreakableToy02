import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Callback from "./Callback";
import Dashboard from "./Dashboard";
import ArtistHeader from "./ArtistHeader";
import { Helmet } from "react-helmet";

function App() {
    return (
        <div className="main-container">
            <Helmet>
                <style>{'body { background: linear-gradient(to right, #121212, #1ED760); }'}</style>
            </Helmet>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/callback" element={<Callback />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/artist/:id" element={<ArtistHeader />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

