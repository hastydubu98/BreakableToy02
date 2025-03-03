package com.breakabletoy.BreakableToy02;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.net.URLEncoder;

@Service
public class SpotifyService {

    private final TokenModel tokenModel;
    private final String tokenUrl = "https://accounts.spotify.com/api/token";

    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;

    public SpotifyService(TokenModel tokenModel) {
        this.tokenModel = tokenModel;
    }

    public void refreshAccessToken() throws IOException {

        // Prepare the request
        String formData = "grant_type=refresh_token" +
                "&refresh_token=" + tokenModel.getRefreshToken() +
                "&client_id=" + clientId +
                "&client_secret=" + clientSecret;
        byte[] postData = formData.getBytes("UTF-8");

        // Send the request
        HttpURLConnection connection = (HttpURLConnection) new URL("https://accounts.spotify.com/api/token").openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        connection.setDoOutput(true);
        OutputStream os = connection.getOutputStream();
        os.write(postData);
        os.flush();
        os.close();

        // Read the response
        if (connection.getResponseCode() == 200) {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                String response = br.readLine();
                String accessToken = response.split("\"access_token\":\"")[1].split("\"")[0];
                int expiresIn = Integer.parseInt(response.split("\"expires_in\":")[1].split(",")[0]);
                tokenModel.saveToken(accessToken, expiresIn);
            }
        } else {
            // Read the error response body
            try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getErrorStream()))) {
                String errorResponse = br.readLine();
                System.out.println("Error Response: " + errorResponse);
            }
            throw new IOException("Error: " + connection.getResponseCode());
        }
    }

    static class TokenResponse {
        private String access_token;
        private int expires_in;

        public String getAccessToken() {
            return access_token;
        }

        public int getExpiresIn() {
            return expires_in;
        }
    }

    public ResponseEntity<String> getInfo(String accessToken, String url) {

        // Set up the authorization header with the access token
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);  // Include the Bearer token

        // Set up the HTTP entity with the authorization header
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Create a RestTemplate to make the HTTP request
        RestTemplate restTemplate = new RestTemplate();

        // Send the GET request to Spotify API to retrieve the artist's information
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        // Return the response body
        return new ResponseEntity<>(response.getBody(), HttpStatus.ACCEPTED);
    }



}
