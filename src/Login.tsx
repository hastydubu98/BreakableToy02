import React, { useState } from 'react';

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
            <h2>Login</h2>
            <button onClick={handleLoginClick}>Login</button>
        </div>
   );
};

export default Login;
