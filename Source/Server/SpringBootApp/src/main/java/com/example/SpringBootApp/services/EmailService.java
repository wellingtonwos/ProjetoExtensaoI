package com.example.SpringBootApp.services;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final Resend resend;
    private final String apiKey;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${app.email.from:onboarding@resend.dev}")
    private String fromEmail;

    public EmailService(@Value("${RESEND_API_KEY:not-configured}") String apiKey) {
        this.apiKey = apiKey;
        this.resend = new Resend(apiKey);
    }

    public void sendPasswordRecoveryEmail(String toEmail, String userName, String token) {
        // Check if API key is configured
        if ("not-configured".equals(apiKey) || apiKey == null || apiKey.trim().isEmpty()) {
            log.warn("RESEND_API_KEY not configured. Email would be sent to: {}. Recovery code: {}", 
                    toEmail, token);
            log.warn("To enable email sending, set the RESEND_API_KEY environment variable.");
            return;
        }
        
        try {
            String htmlContent = buildPasswordRecoveryEmailHtml(userName, token);

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(toEmail)
                    .subject("Password Recovery Code")
                    .html(htmlContent)
                    .build();

            CreateEmailResponse response = resend.emails().send(params);
            log.info("Password recovery email sent successfully. Email ID: {}", response.getId());
            
        } catch (ResendException e) {
            log.error("Failed to send password recovery email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send recovery email", e);
        }
    }

    private String buildPasswordRecoveryEmailHtml(String userName, String token) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" style="width: 100%%; border-collapse: collapse;">
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px 0;">Password Recovery</h1>
                                            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                                Hello%s,
                                            </p>
                                            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                                                You requested to reset your password. Use the code below to reset your password:
                                            </p>
                                            <table role="presentation" style="width: 100%%; border-collapse: collapse;">
                                                <tr>
                                                    <td align="center" style="padding: 30px 0;">
                                                        <div style="background-color: #f8f9fa; border: 2px dashed #007bff; border-radius: 8px; padding: 20px 40px; display: inline-block;">
                                                            <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px; font-family: 'Courier New', monospace;">%s</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                                                This code will expire in 1 hour.
                                            </p>
                                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 10px 0 0 0;">
                                                If you didn't request this, please ignore this email.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                                            <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">
                                                Enter this code in the password reset form to create a new password.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(
                        userName != null ? " " + userName : "",
                        token
                );
    }
}
