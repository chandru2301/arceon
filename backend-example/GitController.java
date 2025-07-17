package com.git.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GitController {

    @Autowired
    private OAuth2AuthorizedClientService authorizedClientService;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/user")
    public ResponseEntity<?> getUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            if (authentication instanceof OAuth2AuthenticationToken) {
                OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
                
                // Get the OAuth2 client
                OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                    oauthToken.getAuthorizedClientRegistrationId(), 
                    oauthToken.getName()
                );
                
                if (client != null) {
                    OAuth2AccessToken accessToken = client.getAccessToken();
                    
                    // Call GitHub API to get user info
                    String userUrl = "https://api.github.com/user";
                    org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                    headers.setBearerAuth(accessToken.getTokenValue());
                    
                    org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
                    
                    ResponseEntity<Map> response = restTemplate.exchange(
                        userUrl, 
                        org.springframework.http.HttpMethod.GET, 
                        entity, 
                        Map.class
                    );
                    
                    Map<String, Object> userInfo = response.getBody();
                    
                    // Return the user info
                    return ResponseEntity.ok(Map.of(
                        "isAuthenticated", true,
                        "user", userInfo
                    ));
                } else {
                    return ResponseEntity.status(401).body(Map.of("error", "OAuth2 client not found"));
                }
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Not OAuth2 authenticated"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping("/github-token")
    public ResponseEntity<?> getGitHubToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            if (authentication instanceof OAuth2AuthenticationToken) {
                OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
                
                // Get the OAuth2 client
                OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                    oauthToken.getAuthorizedClientRegistrationId(), 
                    oauthToken.getName()
                );
                
                if (client != null) {
                    OAuth2AccessToken accessToken = client.getAccessToken();
                    
                    // Return the token for direct GitHub API calls
                    return ResponseEntity.ok(Map.of(
                        "token", accessToken.getTokenValue()
                    ));
                } else {
                    return ResponseEntity.status(401).body(Map.of("error", "OAuth2 client not found"));
                }
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Not OAuth2 authenticated"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Spring Security handles the logout automatically
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // GitHub API proxy endpoints
    @GetMapping("/github/**")
    public ResponseEntity<?> proxyGitHubAPI(@RequestParam String path, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            if (authentication instanceof OAuth2AuthenticationToken) {
                OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
                
                OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                    oauthToken.getAuthorizedClientRegistrationId(), 
                    oauthToken.getName()
                );
                
                if (client != null) {
                    OAuth2AccessToken accessToken = client.getAccessToken();
                    
                    // Call GitHub API
                    String url = "https://api.github.com/" + path;
                    org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
                    headers.setBearerAuth(accessToken.getTokenValue());
                    
                    org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
                    
                    ResponseEntity<String> response = restTemplate.exchange(
                        url, 
                        org.springframework.http.HttpMethod.GET, 
                        entity, 
                        String.class
                    );
                    
                    return ResponseEntity.ok(response.getBody());
                } else {
                    return ResponseEntity.status(401).body(Map.of("error", "OAuth2 client not found"));
                }
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "Not OAuth2 authenticated"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error: " + e.getMessage()));
        }
    }
} 