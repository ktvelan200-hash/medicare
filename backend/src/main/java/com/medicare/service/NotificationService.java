package com.medicare.service;

import com.medicare.dto.NotificationDto;
import com.medicare.entity.User;

import java.util.List;

public interface NotificationService {
    void createNotification(User user, String title, String message);
    List<NotificationDto> getUserNotifications(String email);
    void markAsRead(Long notificationId, String email);
}
