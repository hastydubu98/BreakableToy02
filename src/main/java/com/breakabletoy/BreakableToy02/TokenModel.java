package com.breakabletoy.BreakableToy02;

import org.springframework.stereotype.Component;

@Component
public class TokenModel {
    private String accessToken;
    private String refreshToken;
    private long expiresAt;

    public void saveToken(String token, int expiration) {
        this.accessToken = token;
        this.expiresAt = System.currentTimeMillis() + (expiration * 1000L);
    }

    public void saveRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
        System.out.print(refreshToken);
    }

    public String getAccessToken() {
        if (System.currentTimeMillis() >= expiresAt) {
            return null; // Token expired
        }
        return accessToken;
    }

    public boolean isTokenValid() {
        return accessToken != null && System.currentTimeMillis() < expiresAt;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

}
