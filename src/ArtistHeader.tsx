import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Helmet } from "react-helmet";
import "./ArtistHeader.css";
import Navbar from "./Navbar.tsx"
import playButtonIcon from "./assets/play-button-arrowhead.png"
import ArtistAlbums from "./ArtistAlbums.tsx"

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
  followers: { total: number };
  popularity: number;
  external_urls: { spotify: string };
}

const ArtistHeader = () => {
  const { accessToken } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && accessToken) {
      fetch(`http://localhost:8080/spotify/artist/${id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setArtist(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching artist details:", error);
          setLoading(false);
        });
    }
  }, [id, accessToken]);

  if (loading) return <p>Loading...</p>;
  if (!artist) return <p>Artist not found.</p>;

  return (
    <>
      <Helmet>
        <title>{artist.name} - Artist Dashboard</title>
      </Helmet>

      <Navbar />

      <div className="artist-dashboard">
        {/* Background Section */}
        <div
          className="artist-header"
          style={{
            backgroundImage: `url(${artist.images[0]?.url})`,
          }}
        >
          <h1 className="artist-name">{artist.name}</h1>
        </div>
        <div className="artist-info">
          <p><strong>Followers:</strong> {artist.followers.total.toLocaleString()}</p>
          <button
            onClick={() => window.open(artist.external_urls.spotify, "_blank")}
            className="spotify-button"
          >
            <img src={playButtonIcon} alt="Play Button" />
          </button>
        </div>
      </div>
      <ArtistAlbums />
    </>
  );
};

export default ArtistHeader;
