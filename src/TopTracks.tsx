import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; // Import the Auth Context
import { useNavigate } from "react-router-dom";
import "./TopTracks.css";

interface Track {
    id: string;
    name: string;
    artists: { name: string }[]; // List of artists for the track
    album: { images: { url: string }[] }; // Image URL for the album cover
    external_urls: { spotify: string };
}

const TopTracks = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const [tracks, setTracks] = useState<Track[]>([]); // Renamed from 'artists' to 'tracks'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) {
            navigate("/"); // Redirect to login if no token is found
            return;
        }

        fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.items) {
                    setTracks(data.items); // Set tracks data instead of artists
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching top tracks:", error);
                setLoading(false);
            });
    }, [accessToken, navigate]);

    return (
        <div>
            <h1>Your Top Tracks</h1>
            {loading ? (
                <p>Loading...</p>
            ) : tracks.length === 0 ? (
                <p>No tracks found.</p>
            ) : (
                <div className="tracks-container">
                    {tracks.map((track) => (
                        <div key={track.id} className="track-card">
                            <img
                                src={track.album.images[0]?.url}
                                alt={track.name}
                                className="track-image"
                            />
                            <h3>{track.name}</h3>
                            <p>{track.artists.map(artist => artist.name).join(", ")}</p>
                            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                                Listen on Spotify
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopTracks;
