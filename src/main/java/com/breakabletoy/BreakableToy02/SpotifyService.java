package com.breakabletoy.BreakableToy02;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class SpotifyService {
    private final String SPOTIFY_TOP_ARTISTS_URL = "https://api.spotify.com/v1/me/top/artists?limit=5"; // Change limit if needed

    public List<Map<String, Object>> getTopArtists(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        System.out.print(accessToken);
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(SPOTIFY_TOP_ARTISTS_URL, HttpMethod.GET, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> body = response.getBody();
            return (List<Map<String, Object>>) body.get("items");
        }

        return List.of();
    }
}
