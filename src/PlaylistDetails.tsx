import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Get access token
import "./PlaylistDetails.css";
import Navbar from "./Navbar.tsx";
import playButtonIcon from "./assets/play-button-arrowhead.png";

interface Playlist {
  id: string;
  name: string;
  images?: { url: string }[];
  owner: { display_name: string };
  external_urls: { spotify: string };
  tracks: { items: { track: { id: string; name: string; duration_ms: number; artists: { name: string }[] } }[] };
}

const PlaylistDetails = () => {
  const { accessToken } = useAuth();
  const { id } = useParams(); // Get playlist ID from URL
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !id) return;

    fetch(`http://localhost:8080/spotify/playlists/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPlaylist(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching playlist details:", error);
        setLoading(false);
      });
  }, [accessToken, id]);

  return (
    <>
      <Navbar />
      <div className="playlist-details-container">
        {loading ? (
          <p>Loading...</p>
        ) : playlist ? (
          <>
            <div className="playlist-header">
              <img src={playlist.images?.[0]?.url || "default-placeholder.png"} alt={playlist.name} className="playlist-cover" />
              <div className="playlist-info">
                <h1>{playlist.name}</h1>
                <p style={{ fontWeight: "bold" }}>By {playlist.owner.display_name}</p>
                <button
                  onClick={() => window.open(playlist.external_urls.spotify, "_blank")}
                  className="spotify-button"
                >
                  <img src={playButtonIcon} alt="Play Button" />
                </button>
              </div>
            </div>
            <div className="tracklist">
              <h2>Tracks</h2>
              <ul>
                {playlist.tracks.items.map((item, index) => (
                  <li key={item.track.id}>
                    <a
                      href={`https://open.spotify.com/track/${item.track.id}`} // Direct Spotify link
                      target="_blank"
                      rel="noopener noreferrer"
                      className="track-link"
                    >
                      {index + 1}. {item.track.name} - {item.track.artists.map(artist => artist.name).join(", ")} - {Math.floor(item.track.duration_ms / 60000)}:
                      {(Math.floor(item.track.duration_ms / 1000) % 60).toString().padStart(2, "0")}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p>Playlist not found.</p>
        )}
      </div>
    </>
  );
};

export default PlaylistDetails;
