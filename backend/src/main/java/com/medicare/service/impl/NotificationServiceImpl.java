package com.medicare.service.impl;

import com.medicare.dto.NotificationDto;
import com.medicare.entity.Notification;
import com.medicare.entity.User;
import com.medicare.exception.ResourceNotFoundException;
import com.medicare.mapper.ModelMapper;
import com.medicare.repository.NotificationRepository;
import com.medicare.repository.UserRepository;
import com.medicare.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public void createNotification(User user, String title, String message) {
        Notification notification = new Notification(user, title, message);
        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationDto> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(modelMapper::mapToNotificationDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, String email) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        if (notification.getUser().getEmail().equals(email)) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
    }
}
