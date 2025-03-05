import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./TopArtists.css";

interface Artist {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
    external_urls: { spotify: string };
}

const TopArtists = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) {
            navigate("/"); // Redirect to login if no token is found
            return;
        }

        fetch("http://localhost:8080/me/top/artists", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
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

const handleImageClick = (artistId: string) => {
    navigate(`/artist/${artistId}`);
};

    return (
        <div className="main-content">
            <h1 className="">Your Top Artists</h1>
            {loading ? (
                <p>Loading...</p>
            ) : artists.length === 0 ? (
                <p>No artists found.</p>
            ) : (
                <div className="artists-container">
                    {artists.map((artist) => (
                    <div key={artist.id} className="artist-card">
                        <img
                            src={artist.images[0]?.url}
                            alt={artist.name}
                            className="artist-image"
                            onClick={() => handleImageClick(artist.id)}
                        />
                        <h3 className="">{artist.name}</h3>
                        <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                            Listen on Spotify
                        </a>
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopArtists;