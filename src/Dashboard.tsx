import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; // Import the Auth Context
import { useNavigate } from "react-router-dom";

interface Artist {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
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
        <div className="p-8 bg-gray-900 text-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Your Top Artists</h1>

            {loading ? (
                <p>Loading...</p>
            ) : artists.length === 0 ? (
                <p>No artists found.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {artists.map((artist) => (
                        <div key={artist.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <img src={artist.images[0]?.url} alt={artist.name} className="rounded-lg w-full" />
                            <h2 className="mt-3 text-lg font-semibold">{artist.name}</h2>
                            <p className="text-sm text-gray-400">{artist.genres.join(", ")}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
