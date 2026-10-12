package com.medicare.dto;

import jakarta.validation.constraints.NotNull;

public class UserStatusUpdateDto {

    @NotNull(message = "Enabled flag is required")
    private Boolean enabled;

    public UserStatusUpdateDto() {}

    public UserStatusUpdateDto(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
}
