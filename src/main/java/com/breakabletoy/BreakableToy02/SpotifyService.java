package com.breakabletoy.BreakableToy02;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class SpotifyService {

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
        return response;
    }
}
