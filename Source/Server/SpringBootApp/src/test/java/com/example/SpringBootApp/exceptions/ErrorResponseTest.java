package com.example.SpringBootApp.exceptions;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class ErrorResponseTest {

    @Test
    public void twoArgConstructor_setsTimestamp() {
        ErrorResponse er = new ErrorResponse(404, "Not found");
        assertEquals(404, er.getStatus());
        assertEquals("Not found", er.getMessage());
        assertNotNull(er.getTimestamp());
    }

    @Test
    public void allArgsConstructor_setsFields() {
        LocalDateTime t = LocalDateTime.of(2020, 1, 1, 0, 0);
        ErrorResponse er = new ErrorResponse(500, "err", t);
        assertEquals(500, er.getStatus());
        assertEquals("err", er.getMessage());
        assertEquals(t, er.getTimestamp());
    }
}
