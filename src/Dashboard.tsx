import "./Dashboard.css";
import TopArtists from "./TopArtists.jsx"
import TopTracks from "./TopTracks.jsx"
import Navbar from "./Navbar.jsx"


const Dashboard = () => {

    return (
        <>
            <Navbar />
            <TopArtists />
            <TopTracks />
        </>
    );
};

export default Dashboard;
