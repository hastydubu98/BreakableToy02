import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; // Import the Auth Context
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import spotifyLogo from "./assets/Primary_Logo_White_CMYK.svg";
import homeIcon from "./assets/icons8-home.svg";
import "./TopArtists.css";
import TopArtists from "./TopArtists.jsx"
import TopTracks from "./TopTracks.jsx"


interface Artist {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
    external_urls: { spotify: string };
}

const Dashboard = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) {
            navigate("/"); // Redirect to login if no token is found
            return;
        }

        fetch("https://api.spotify.com/v1/me/top/artists", {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.items) {
                    setArtists(data.items);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching top artists:", error);
                setLoading(false);
            });
    }, [accessToken, navigate]);

    return (
        <>
            <body className="main-container">
                <nav className="navbar">
                  <div className="navbar-container">
                    <a href="/" className="logo-link">
                        <img src={spotifyLogo} alt="Spotify Logo" className="logo" />
                    </a>
                    <button className="home-button">
                        <img src={homeIcon} alt="Home" className="home-icon" />
                    </button>
                    <input type="text" placeholder="Search..." className="search-input" />
                  </div>
                </nav>
                <TopArtists />
                <TopTracks />
            </body>
        </>
    );
};

export default Dashboard;
