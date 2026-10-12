package com.medicare.service.impl;

import com.medicare.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from:noreply@medicare.com}")
    private String fromEmail;

    // -------------------------------------------------------
    // Base email sender
    // -------------------------------------------------------

    @Async
    @Override
    public void sendEmail(String to, String subject, String htmlBody) {
        if (!mailEnabled || mailSender == null) {
            log.info("[EMAIL DISABLED] To: {} | Subject: {}", to, subject);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("[EMAIL SENT] To: {} | Subject: {}", to, subject);
        } catch (MessagingException e) {
            log.error("[EMAIL FAILED] To: {} | Error: {}", to, e.getMessage());
        }
    }

    // -------------------------------------------------------
    // Appointment Confirmation (sent to patient after booking)
    // -------------------------------------------------------

    @Override
    public void sendAppointmentConfirmation(String toEmail, String patientName,
                                             String doctorName, String date, String timeSlot) {
        String subject = "✅ Appointment Booked – MediCare";
        String body = buildHtmlEmail(
            "Appointment Confirmed!",
            "Hi <strong>" + patientName + "</strong>,",
            "Your appointment request has been submitted successfully.",
            new String[][]{
                {"Doctor",    "Dr. " + doctorName},
                {"Date",      date},
                {"Time Slot", timeSlot},
                {"Status",    "⏳ Pending Doctor Confirmation"}
            },
            "You will be notified once the doctor confirms your appointment.",
            "#0284c7"
        );
        sendEmail(toEmail, subject, body);
    }

    // -------------------------------------------------------
    // Appointment Status Update
    // -------------------------------------------------------

    @Override
    public void sendAppointmentStatusUpdate(String toEmail, String patientName,
                                             String doctorName, String date, String status) {
        String emoji = switch (status.toUpperCase()) {
            case "CONFIRMED"  -> "✅";
            case "REJECTED"   -> "❌";
            case "COMPLETED"  -> "🏥";
            case "CANCELLED"  -> "🚫";
            default           -> "🔔";
        };
        String subject = emoji + " Appointment " + status + " – MediCare";
        String body = buildHtmlEmail(
            "Appointment " + status,
            "Hi <strong>" + patientName + "</strong>,",
            "Your appointment status has been updated.",
            new String[][]{
                {"Doctor", "Dr. " + doctorName},
                {"Date",   date},
                {"Status", emoji + " " + status}
            },
            "Log in to MediCare to view details.",
            "#0d9488"
        );
        sendEmail(toEmail, subject, body);
    }

    // -------------------------------------------------------
    // 24-Hour Reminder (sent by scheduler)
    // -------------------------------------------------------

    @Override
    public void sendAppointmentReminder(String toEmail, String patientName,
                                         String doctorName, String date, String timeSlot) {
        String subject = "⏰ Reminder: Appointment Tomorrow – MediCare";
        String body = buildHtmlEmail(
            "Appointment Reminder",
            "Hi <strong>" + patientName + "</strong>,",
            "This is a friendly reminder that you have an appointment <strong>tomorrow</strong>.",
            new String[][]{
                {"Doctor",    "Dr. " + doctorName},
                {"Date",      date},
                {"Time Slot", timeSlot}
            },
            "Please arrive 10 minutes early. Log in to MediCare if you need to reschedule.",
            "#f59e0b"
        );
        sendEmail(toEmail, subject, body);
    }

    // -------------------------------------------------------
    // New Appointment Alert (sent to doctor)
    // -------------------------------------------------------

    @Override
    public void sendNewAppointmentAlertToDoctor(String toEmail, String doctorName,
                                                  String patientName, String date, String timeSlot) {
        String subject = "📋 New Appointment Request – MediCare";
        String body = buildHtmlEmail(
            "New Appointment Request",
            "Hi Dr. <strong>" + doctorName + "</strong>,",
            "You have received a new appointment request.",
            new String[][]{
                {"Patient",   patientName},
                {"Date",      date},
                {"Time Slot", timeSlot}
            },
            "Please log in to MediCare to accept or reject the request.",
            "#0284c7"
        );
        sendEmail(toEmail, subject, body);
    }

    // -------------------------------------------------------
    // Prescription Issued Notification (sent to patient)
    // -------------------------------------------------------

    @Override
    public void sendPrescriptionIssuedNotification(String toEmail, String patientName,
                                                    String doctorName, String diagnosis) {
        String subject = "💊 Prescription Issued – MediCare";
        String body = buildHtmlEmail(
            "Your Prescription is Ready",
            "Hi <strong>" + patientName + "</strong>,",
            "Dr. " + doctorName + " has issued a new prescription for you.",
            new String[][]{
                {"Doctor",    "Dr. " + doctorName},
                {"Diagnosis", diagnosis}
            },
            "Log in to MediCare to view and print your prescription.",
            "#10b981"
        );
        sendEmail(toEmail, subject, body);
    }

    @Override
    public void sendDoctorApprovalNotification(String toEmail, String doctorName) {
        String subject = "🎉 Doctor Profile Approved – MediCare";
        String body = buildHtmlEmail(
            "Account Verified & Approved!",
            "Hi Dr. <strong>" + doctorName + "</strong>,",
            "Congratulations! Your doctor profile has been verified and approved by the MediCare Administration team.",
            new String[][]{
                {"Status", "✅ ACTIVE & VERIFIED"},
                {"Next Steps", "Set your weekly working hours and slot availability"}
            },
            "You can now receive and manage patient appointment bookings online.",
            "#10b981"
        );
        sendEmail(toEmail, subject, body);
    }

    @Override
    public void sendDoctorRejectionNotification(String toEmail, String doctorName, String reason) {
        String subject = "⚠️ Doctor Profile Status Update – MediCare";
        String body = buildHtmlEmail(
            "Application Review Update",
            "Hi Dr. <strong>" + doctorName + "</strong>,",
            "Thank you for applying to MediCare. Unfortunately, your doctor profile could not be approved at this time.",
            new String[][]{
                {"Status", "❌ REJECTED"},
                {"Reason", reason != null ? reason : "Documentation or verification criteria not met"}
            },
            "If you believe this is an error or would like to re-submit credentials, please contact admin@medicare.com.",
            "#ef4444"
        );
        sendEmail(toEmail, subject, body);
    }

    // -------------------------------------------------------
    // HTML Email Template Builder
    // -------------------------------------------------------

    private String buildHtmlEmail(String heading, String greeting, String intro,
                                   String[][] details, String footer, String accentColor) {
        StringBuilder rows = new StringBuilder();
        for (String[] row : details) {
            rows.append("<tr>")
                .append("<td style='padding:8px 12px;font-size:13px;font-weight:600;color:#64748b;width:35%;border-bottom:1px solid #f1f5f9'>").append(row[0]).append("</td>")
                .append("<td style='padding:8px 12px;font-size:13px;color:#0f172a;border-bottom:1px solid #f1f5f9'>").append(row[1]).append("</td>")
                .append("</tr>");
        }

        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
              <div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
                <!-- Header -->
                <div style="background:linear-gradient(135deg,%s,#0d9488);padding:28px 32px">
                  <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px">🏥 MediCare</h1>
                  <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8)">Online Healthcare Management Platform</p>
                </div>
                <!-- Body -->
                <div style="padding:32px">
                  <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a">%s</h2>
                  <p style="margin:0 0 20px;font-size:14px;color:#475569">%s</p>
                  <p style="margin:0 0 16px;font-size:14px;color:#334155">%s</p>
                  <!-- Details Table -->
                  <table style="width:100%%;border-collapse:collapse;background:#f8fafc;border-radius:10px;overflow:hidden;margin-bottom:24px">
                    %s
                  </table>
                  <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6">%s</p>
                </div>
                <!-- Footer -->
                <div style="padding:20px 32px;background:#f1f5f9;border-top:1px solid #e2e8f0;text-align:center">
                  <p style="margin:0;font-size:12px;color:#94a3b8">© 2024 MediCare · This is an automated notification. Please do not reply to this email.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(accentColor, heading, greeting, intro, rows, footer);
    }
}
