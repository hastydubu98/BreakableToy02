import React, { useState } from 'react';
import "./Login.css";
import spotifyLogo from "./assets/Primary_Logo_Green_CMYK.svg";

const Login: React.FC = () => {

    const handleLoginClick = () => {
            // Call backend to initiate OAuth process
        fetch("http://localhost:8080/auth/spotify", {
            method: "POST",
        })
        .then(response => response.json())
        .then(data => {
            if (data.redirect_url) {
                // Redirect user to Spotify's login page
                window.location.href = data.redirect_url;
            } else {
                console.error("Error: ", data);
            }
        });
    };

    return (
        <div className="login-container">
          <div className="login-card">
            <img src={spotifyLogo} alt="Spotify Logo" className="spotify-logo" />
            <h2>Welcome!</h2>
            <p>Sign in to continue</p>
            <button onClick={handleLoginClick} className="login-button">
              Log In
            </button>
          </div>
        </div>
   );
};

export default Login;
