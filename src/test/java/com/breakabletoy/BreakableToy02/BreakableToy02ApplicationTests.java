package com.breakabletoy.BreakableToy02;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class BreakableToy02ApplicationTests {

	private MockMvc mockMvc;

	@Mock
	private TokenModel tokenModel;

	@Mock
	private SpotifyService spotifyService;

	@InjectMocks
	private Controller controller;

	@BeforeEach
	void setup() {
		mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
	}

	@Test
	void testInitiateSpotifyLogin() throws Exception {
		mockMvc.perform(post("/auth/spotify"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.redirect_url").exists());
	}

	@Test
	void testSpotifyCallback() throws Exception {
		mockMvc.perform(get("/auth/spotify/callback").param("code", "test_code"))
				.andExpect(status().isFound())
				.andExpect(header().string("Location", "http://localhost:9090/callback?code=test_code"));
	}

	@Test
	void testGetTopArtists() throws Exception {
		Mockito.when(tokenModel.isTokenValid()).thenReturn(true);
		Mockito.when(tokenModel.getAccessToken()).thenReturn("test_token");
		Mockito.when(spotifyService.getInfo(Mockito.any(), Mockito.any()))
				.thenReturn(ResponseEntity.ok("Top artists response"));

		mockMvc.perform(get("/me/top/artists"))
				.andExpect(status().isOk())
				.andExpect(content().string("Top artists response"));
	}

	@Test
	void testGetTopTracks() throws Exception {
		Mockito.when(tokenModel.isTokenValid()).thenReturn(true);
		Mockito.when(tokenModel.getAccessToken()).thenReturn("test_token");
		Mockito.when(spotifyService.getInfo(Mockito.any(), Mockito.any()))
				.thenReturn(ResponseEntity.ok("Top tracks response"));

		mockMvc.perform(get("/me/top/tracks"))
				.andExpect(status().isOk())
				.andExpect(content().string("Top tracks response"));
	}

	@Test
	void testGetArtistInfo() throws Exception {
		Mockito.when(tokenModel.isTokenValid()).thenReturn(true);
		Mockito.when(tokenModel.getAccessToken()).thenReturn("test_token");
		Mockito.when(spotifyService.getInfo(Mockito.any(), Mockito.any()))
				.thenReturn(ResponseEntity.ok("Artist info response"));

		mockMvc.perform(get("/spotify/artist/123"))
				.andExpect(status().isOk())
				.andExpect(content().string("Artist info response"));
	}

	@Test
	void testGetArtistAlbums() throws Exception {
		Mockito.when(tokenModel.isTokenValid()).thenReturn(true);
		Mockito.when(tokenModel.getAccessToken()).thenReturn("test_token");
		Mockito.when(spotifyService.getInfo(Mockito.any(), Mockito.any()))
				.thenReturn(ResponseEntity.ok("Artist albums response"));

		mockMvc.perform(get("/spotify/artist/123/albums"))
				.andExpect(status().isOk())
				.andExpect(content().string("Artist albums response"));
	}

	@Test
	void testGetAlbumInfo() throws Exception {
		Mockito.when(tokenModel.isTokenValid()).thenReturn(true);
		Mockito.when(tokenModel.getAccessToken()).thenReturn("test_token");
		Mockito.when(spotifyService.getInfo(Mockito.any(), Mockito.any()))
				.thenReturn(ResponseEntity.ok("Album info response"));

		mockMvc.perform(get("/spotify/album/456"))
				.andExpect(status().isOk())
				.andExpect(content().string("Album info response"));
	}

	@Test
	void testGetPlaylistInfo() throws Exception {
		Mockito.when(tokenModel.isTokenValid()).thenReturn(true);
		Mockito.when(tokenModel.getAccessToken()).thenReturn("test_token");
		Mockito.when(spotifyService.getInfo(Mockito.any(), Mockito.any()))
				.thenReturn(ResponseEntity.ok("Playlist info response"));

		mockMvc.perform(get("/spotify/playlists/789"))
				.andExpect(status().isOk())
				.andExpect(content().string("Playlist info response"));
	}

	@Test
	void testSearchSpotify() throws Exception {
		Mockito.when(tokenModel.isTokenValid()).thenReturn(true);
		Mockito.when(tokenModel.getAccessToken()).thenReturn("test_token");
		Mockito.when(spotifyService.getInfo(Mockito.any(), Mockito.any()))
				.thenReturn(ResponseEntity.ok("Search response"));

		mockMvc.perform(get("/spotify/search").param("query", "test"))
				.andExpect(status().isOk())
				.andExpect(content().string("Search response"));
	}
}
