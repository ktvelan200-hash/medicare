package com.medicare.dto;

import com.medicare.entity.Role;

public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private Long roleSpecificId; // Doctor ID or Patient ID

    public JwtAuthResponse() {}

    public JwtAuthResponse(String accessToken, Long id, String email, String fullName, Role role, Long roleSpecificId) {
        this.accessToken = accessToken;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.roleSpecificId = roleSpecificId;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Long getRoleSpecificId() { return roleSpecificId; }
    public void setRoleSpecificId(Long roleSpecificId) { this.roleSpecificId = roleSpecificId; }
}
