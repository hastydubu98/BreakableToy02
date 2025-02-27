import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Navbar from "./Navbar.tsx";
import "./SearchResults.css";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
}

const SearchResults = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");

  useEffect(() => {
    if (!query || !accessToken) return;

    fetch(`https://api.spotify.com/v1/search?q=${query}&type=artist,album&limit=10`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setArtists(data.artists?.items || []);
        setAlbums(data.albums?.items || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setLoading(false);
      });
  }, [query, accessToken]);

  return (
    <>
      <Navbar />
      <div className="search-results-container">
        <h1>Search Results for "{query}"</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Artists Section */}
            {artists.length > 0 && (
              <div className="results-section">
                <h2>Artists</h2>
                <div className="results-grid">
                  {artists.map((artist) => (
                    <div key={artist.id} className="result-card" onClick={() => navigate(`/artist/${artist.id}`)}>
                      <img src={artist.images[0]?.url} alt={artist.name} className="result-image" />
                      <p>{artist.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Albums Section */}
            {albums.length > 0 && (
              <div className="results-section">
                <h2>Albums</h2>
                <div className="results-grid">
                  {albums.map((album) => (
                    <div key={album.id} className="result-card" onClick={() => navigate(`/album/${album.id}`)}>
                      <img src={album.images[0]?.url} alt={album.name} className="result-image" />
                      <p>{album.name} - {album.artists[0]?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SearchResults;
