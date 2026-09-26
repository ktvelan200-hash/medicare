package com.medicare.controller;

import com.medicare.dto.ApiResponse;
import com.medicare.dto.NotificationDto;
import com.medicare.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "Endpoints for user alerts and notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get User Notifications", description = "Fetch all notifications for the authenticated user")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications(Authentication authentication) {
        List<NotificationDto> notifications = notificationService.getUserNotifications(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark Notification as Read", description = "Updates notification read status")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Long id, Authentication authentication) {
        notificationService.markAsRead(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", null));
    }
}
