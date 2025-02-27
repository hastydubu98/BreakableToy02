package com.breakabletoy.BreakableToy02;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.Base64;
import java.util.Collections;
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
    public ResponseEntity<Map<String, String>> initiateSpotifyLogin() {
        // Generate Spotify authorization URL
        String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.spotify.com/authorize")
                .queryParam("client_id", clientId)
                .queryParam("response_type", "code")
                .queryParam("redirect_uri", redirectUri)
                .queryParam("scope", "user-top-read user-read-private") // Add any necessary scopes here
                .queryParam("state", "state_parameter_passthrough_value") // Optional, can be used for CSRF protection
                .toUriString();

        // Return the URL to the frontend so it can redirect the user
        return ResponseEntity.ok(Map.of("redirect_url", authUrl));
    }

    // Step 2: Handle the callback from Spotify after user authentication
    @GetMapping("/auth/spotify/callback")
    public ResponseEntity<Void> spotifyCallback(@RequestParam("code") String code) {
        String frontendRedirectUrl = "http://localhost:9090/callback?code=" + code;
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(frontendRedirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @PostMapping("/auth/spotify/exchange")
    public ResponseEntity<Map<String, Object>> exchangeToken(@RequestParam("code") String code) {
        String url = "https://accounts.spotify.com/api/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setBasicAuth(clientId, clientSecret); // Use Client ID & Secret

        String requestBody = "grant_type=authorization_code"
                + "&code=" + code
                + "&redirect_uri=http://localhost:8080/auth/spotify/callback"; // Must match Spotify settings

        RestTemplate restTemplate = new RestTemplate();
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        Map<String, Object> responseBody = response.getBody();
        if (responseBody != null && responseBody.containsKey("access_token")) {
            String token = (String) responseBody.get("access_token");
            int expiresIn = (int) responseBody.get("expires_in");

            // Store token for later use
            tokenStorage.saveToken(token, expiresIn);

            return ResponseEntity.ok(responseBody);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Invalid authorization code"));
    }

    @GetMapping("/me/top/artists")
    public ResponseEntity<String> getTopArtists(HttpServletResponse response) {
        response.getHeaderNames().forEach(header -> {
            System.out.println(header + ": " + response.getHeader(header));
        });

        String accessToken = tokenStorage.getAccessToken();
        String url = "https://api.spotify.com/v1/me/top/artists?limit=10";
        if (accessToken == null) {
            throw new RuntimeException("Access token is missing or expired. Please authenticate again.");
        }

        return spotifyService.getInfo(accessToken, url);
    }

    @GetMapping("/me/top/tracks")
    public ResponseEntity<String> getTopTracks(HttpServletResponse response) {
        response.getHeaderNames().forEach(header -> {
            System.out.println(header + ": " + response.getHeader(header));
        });

        String accessToken = tokenStorage.getAccessToken();
        String url = "https://api.spotify.com/v1/me/top/tracks  ?limit=10";
        if (accessToken == null) {
            throw new RuntimeException("Access token is missing or expired. Please authenticate again.");
        }

        return spotifyService.getInfo(accessToken, url);
    }

    @GetMapping("/spotify/artist/{id}")
    public ResponseEntity<String> getArtistInfo(@PathVariable String id) {

        String accessToken = tokenStorage.getAccessToken();
        // Spotify API endpoint to get artist details
        String url = "https://api.spotify.com/v1/artists/" + id;

        if (accessToken == null) {
            throw new RuntimeException("Access token is missing or expired. Please authenticate again.");
        }
        return spotifyService.getInfo(accessToken, url);
    }

    @GetMapping("/spotify/artist/{id}/albums")
    public ResponseEntity<String> getArtistAlbums(@PathVariable String id) {

        String accessToken = tokenStorage.getAccessToken();
        // Spotify API endpoint to get artist details
        String url = "https://api.spotify.com/v1/artists/" + id + "/albums?limit=12";

        if (accessToken == null) {
            throw new RuntimeException("Access token is missing or expired. Please authenticate again.");
        }
        return spotifyService.getInfo(accessToken, url);
    }

    // Endpoint to get album information from the Spotify API
    @GetMapping("/spotify/album/{id}")
    public ResponseEntity<String> getAlbumInfo(@PathVariable String id) {

        String accessToken = tokenStorage.getAccessToken();

        // Spotify API endpoint to get album details
        String url = "https://api.spotify.com/v1/albums/" + id;

        if (accessToken == null) {
            throw new RuntimeException("Access token is missing or expired. Please authenticate again.");
        }
        return spotifyService.getInfo(accessToken, url);
    }

    @GetMapping("/spotify/playlists/{id}")
    public ResponseEntity<String> getPlaylistInfo(@PathVariable String id) {

        String accessToken = tokenStorage.getAccessToken();

        // Spotify API endpoint to get album details
        String url = "https://api.spotify.com/v1/playlists/" + id;

        if (accessToken == null) {
            throw new RuntimeException("Access token is missing or expired. Please authenticate again.");
        }
        return spotifyService.getInfo(accessToken, url);
    }

    @GetMapping("/spotify/search")
    public ResponseEntity<String> searchSpotify(
            @RequestParam String query) {

        String accessToken = tokenStorage.getAccessToken();

        // Spotify API search endpoint
        String url = "https://api.spotify.com/v1/search?q=" + query + "&type=artist,album,playlist,track&limit=10"; // Limit to 10 results

        if (accessToken == null) {
            throw new RuntimeException("Access token is missing or expired. Please authenticate again.");
        }
        return spotifyService.getInfo(accessToken, url);
    }
}
