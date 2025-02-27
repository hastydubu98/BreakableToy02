import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import Login from "./Login";
import Callback from "./Callback";
import Dashboard from "./Dashboard";
import ArtistHeader from "./ArtistHeader";
import AlbumDetails from "./AlbumDetails";
import SearchResults from "./SearchResults.tsx";


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
                    <Route path="/album/:id" element={<AlbumDetails />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

