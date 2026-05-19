package com.example.SpringBootApp.services;

import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class EmailServiceBranchTest {

    @Test
    public void noApiKey_doesNotCallTemplate() {
        EmailTemplateService template = mock(EmailTemplateService.class);
        EmailService svc = new EmailService("not-configured", template);
        svc.sendPasswordRecoveryEmail("a@b.com","user","token");
        verify(template, never()).buildCodigoRecuperacaoSenhaHtml(anyString(), anyString());
    }

    @Test
    public void doSendThrows_wrapped() {
        EmailTemplateService template = mock(EmailTemplateService.class);
        when(template.buildCodigoRecuperacaoSenhaHtml(anyString(), anyString())).thenReturn("<html/>");
        EmailService svc = new EmailService("apikey", template) {
            @Override
            protected CreateEmailResponse doSend(CreateEmailOptions params) throws ResendException {
                throw new ResendException("fail");
            }
        };
        assertThrows(RuntimeException.class, () -> svc.sendPasswordRecoveryEmail("a@b.com","u","t"));
    }

    @Test
    public void doSendSuccess() {
        EmailTemplateService template = mock(EmailTemplateService.class);
        when(template.buildCodigoRecuperacaoSenhaHtml(anyString(), anyString())).thenReturn("<html/>");
        EmailService svc = new EmailService("apikey", template) {
            @Override
            protected CreateEmailResponse doSend(CreateEmailOptions params) {
                return null;
            }
        };
        assertDoesNotThrow(() -> svc.sendPasswordRecoveryEmail("a@b.com","u","t"));
        verify(template).buildCodigoRecuperacaoSenhaHtml("u","t");
    }
}
