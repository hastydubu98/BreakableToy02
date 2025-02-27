import { useState } from "react";
import { useNavigate } from "react-router-dom";
import spotifyLogo from "./assets/Primary_Logo_White_CMYK.svg";
import homeIcon from "./assets/icons8-home.svg";
import "./Navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Handle search submission
  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/dashboard" className="logo-link">
          <img src={spotifyLogo} alt="Spotify Logo" className="logo" />
        </a>
        <button className="home-button" onClick={() => navigate("/dashboard")}>
          <img src={homeIcon} alt="Home" className="home-icon" />
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
    </nav>
  );
};

export default Navbar;