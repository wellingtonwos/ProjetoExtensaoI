package com.example.SpringBootApp.services;

import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class EmailServiceDoSendIdTest {

    @Test
    public void doSendReturnsResponse_getsId() {
        EmailTemplateService template = mock(EmailTemplateService.class);
        when(template.buildCodigoRecuperacaoSenhaHtml(anyString(), anyString())).thenReturn("<html>");
        CreateEmailResponse response = mock(CreateEmailResponse.class);
        when(response.getId()).thenReturn("RID");
        EmailService svc = new EmailService("apikey", template) {
            @Override
            protected CreateEmailResponse doSend(CreateEmailOptions params) {
                return response;
            }
        };
        assertDoesNotThrow(() -> svc.sendPasswordRecoveryEmail("a@b","u","t"));
        verify(template).buildCodigoRecuperacaoSenhaHtml("u","t");
    }
}
