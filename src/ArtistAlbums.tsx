import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Get access token from context
import "./ArtistAlbums.css";

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  release_date: string;
  external_urls: { spotify: string };
}

const ArtistAlbums = () => {
  const { accessToken } = useAuth();
  const { id } = useParams(); // Get artist ID from URL
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !id) return;

    fetch(`https://api.spotify.com/v1/artists/${id}/albums?limit=12`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          setAlbums(data.items);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching albums:", error);
        setLoading(false);
      });
  }, [accessToken, id]);

  return (
    <div className="albums-container">
      <h1>Albums</h1>
      {loading ? (
        <p>Loading...</p>
      ) : albums.length === 0 ? (
        <p>No albums found.</p>
      ) : (
        <div className="album-grid">
          {albums.map((album) => (
            <a
              key={album.id}
              href={album.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="album-card"
            >
              <img src={album.images[0]?.url} alt={album.name} className="album-image" />
              <div className="album-info">
                <h3>{album.name}</h3>
                <p>{album.release_date}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistAlbums;
