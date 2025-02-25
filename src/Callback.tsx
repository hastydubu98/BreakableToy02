import { useEffect } from "react";
import { useAuth } from "./AuthContext"; // Import Auth Context
import { useNavigate } from "react-router-dom";

const Callback = () => {
    const { saveAccessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            fetch(`http://localhost:8080/auth/spotify/exchange?code=${code}`, {
                method: "POST",
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.access_token) {
                        saveAccessToken(data.access_token, data.expires_in);
                        navigate("/dashboard"); // Redirect to dashboard or home
                    }
                })
                .catch((error) => console.error("Error exchanging token:", error));
        }
    }, [navigate, saveAccessToken]);

    return <div>Processing login...</div>;
};

export default Callback;
