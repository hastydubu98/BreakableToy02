import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; // Import the Auth Context
import { useNavigate } from "react-router-dom";
import spotifyLogo from "./assets/Primary_Logo_White_CMYK.svg";
import homeIcon from "./assets/icons8-home.svg";
import "./Navbar.css"

const Navbar = () => {

    return (
        <nav className="navbar">
          <div className="navbar-container">
            <a href="/dashboard" className="logo-link">
                <img src={spotifyLogo} alt="Spotify Logo" className="logo" />
            </a>
            <button className="home-button">
                <img src={homeIcon} alt="Home" className="home-icon" />
            </button>
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
        </nav>
    );
};

export default Navbar;