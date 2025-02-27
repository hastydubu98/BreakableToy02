import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Get access token
import "./AlbumDetails.css";
import Navbar from "./Navbar.tsx"
import playButtonIcon from "./assets/play-button-arrowhead.png"

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  release_date: string;
  total_tracks: number;
  artists: { name: string; id: string }[];
  external_urls: { spotify: string };
  tracks: { items: { id: string; name: string; duration_ms: number }[] };
}

const AlbumDetails = () => {
  const { accessToken } = useAuth();
  const { id } = useParams(); // Get album ID from URL
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !id) return;

    fetch(`http://localhost:8080/spotify/album/${id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setAlbum(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching album details:", error);
        setLoading(false);
      });
  }, [accessToken, id]);

    return (
        <>
            <Navbar />
            <div className="album-details-container">
              {loading ? (
                <p>Loading...</p>
              ) : album ? (
                <>
                  <div className="album-header">
                    <img src={album.images[0]?.url} alt={album.name} className="album-cover" />
                    <div className="album-info">
                      <h1>{album.name}</h1>
                      <p style={{ fontWeight: "bold", textDecoration: "underline"}}>
                        By{" "}
                        {album.artists.map((artist, index) => (
                          <span key={artist.id}>
                            <a href={`/artist/${artist.id}`} style={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}>
                              {artist.name}
                            </a>
                            {index < album.artists.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </p>
                      <p>Released: {album.release_date}</p>
                      <p>Total Tracks: {album.total_tracks}</p>
                      <button
                        onClick={() => window.open(album.external_urls.spotify, "_blank")}
                        className="spotify-button"
                      >
                        <img src={playButtonIcon} alt="Play Button" />
                      </button>
                    </div>
                  </div>
                  <div className="tracklist">
                    <h2>Tracklist</h2>
                    <ul>
                      {album.tracks.items.map((track, index) => (
                        <li key={track.id}>
                            <a
                                href={`https://open.spotify.com/track/${track.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="track-link"
                            >
                                {index + 1}. {track.name} - {Math.floor(track.duration_ms / 60000)}:
                                {(Math.floor(track.duration_ms / 1000) % 60).toString().padStart(2, "0")}
                            </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p>Album not found.</p>
              )}
            </div>
        </>
  );
};

export default AlbumDetails;
