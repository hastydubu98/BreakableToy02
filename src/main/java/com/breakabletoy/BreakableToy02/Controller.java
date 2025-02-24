package com.breakabletoy.BreakableToy02;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/")
public class Controller {

    @Value("${spotify.client.id}")  // Load from application.properties
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;

    private final TokenModel tokenStorage;
    private final SpotifyService spotifyService;

    public Controller(TokenModel tokenStorage, SpotifyService spotifyService) {
        this.tokenStorage = tokenStorage;
        this.spotifyService = spotifyService;
    }

    private final String redirectUri = "http://localhost:8080/auth/spotify/callback";
    private final String scope = "user-top-read user-read-private"; // Add necessary scopes

    // Step 1: Redirect the user to Spotify's authorization page
    @PostMapping("/auth/spotify")
    public void redirectToSpotifyAuth(HttpServletResponse response) throws IOException {
        String authorizationUrl = "https://accounts.spotify.com/authorize?" +
                "client_id=" + clientId + "&" +
                "response_type=code&" +
                "redirect_uri=" + redirectUri + "&" +
                "scope=" + scope;
        response.sendRedirect(authorizationUrl);
    }

    // Step 2: Handle the callback from Spotify after user authentication
    @GetMapping("auth/spotify/callback")
    public ResponseEntity<Map<String, Object>> getSpotifyToken(@RequestParam String code) {
        String url = "https://accounts.spotify.com/api/token";

        // Encode client_id:client_secret to Base64
        String credentials = clientId + ":" + clientSecret;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());

        // Set HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Basic " + encodedCredentials);

        // Set request body
        String requestBody = "grant_type=authorization_code" +
                "&code=" + code +
                "&redirect_uri=" + redirectUri;

        // Make request
        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null && responseBody.containsKey("access_token")) {
            String accessToken = (String) responseBody.get("access_token");
            String refreshToken = (String) responseBody.get("refresh_token");
            int expiresIn = (int) responseBody.get("expires_in");

            // Save token in memory (or session)
            tokenStorage.saveToken(accessToken, expiresIn);
            tokenStorage.saveRefreshToken(refreshToken);

            // You can now use this access token to make API calls to get user data.
        }

        return ResponseEntity.ok(response.getBody());
    }

    @GetMapping("/me/top/artists")
    public List<Map<String, Object>> getTopArtists() {
        String accessToken = tokenStorage.getAccessToken();
        if (accessToken == null) {
            throw new RuntimeException("Access token is missing or expired. Please authenticate again.");
        }
        return spotifyService.getTopArtists(accessToken);
    }

    @GetMapping("/spotify/artist/{id}")
    public ResponseEntity<String> getArtistInfo(@PathVariable String id) {

        // Spotify API endpoint to get artist details
        String url = "https://api.spotify.com/v1/artists/" + id;

        String accessToken = tokenStorage.getAccessToken();

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
        return response;
    }

    // Endpoint to get album information from the Spotify API
    @GetMapping("/spotify/album/{id}")
    public ResponseEntity<String> getAlbumInfo(@PathVariable String id) {

        String accessToken = tokenStorage.getAccessToken();

        // Spotify API endpoint to get album details
        String url = "https://api.spotify.com/v1/albums/" + id;

        // Set up the authorization header with the access token (Bearer token)
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);  // Include the Bearer token

        // Set up the HTTP entity with the authorization header
        HttpEntity<String> entity = new HttpEntity<>(headers);

        // Create a RestTemplate to make the HTTP request
        RestTemplate restTemplate = new RestTemplate();

        // Send the GET request to Spotify API to retrieve the album's information
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        // Return the response body (Spotify API response in JSON)
        return response;
    }
}
