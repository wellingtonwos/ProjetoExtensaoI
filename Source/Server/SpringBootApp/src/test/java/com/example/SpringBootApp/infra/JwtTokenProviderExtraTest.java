package com.example.SpringBootApp.infra;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderExtraTest {

    @Test
    void integerUserIdClaimIsHandled() throws Exception {
        JwtTokenProvider provider = new JwtTokenProvider();
        byte[] keyBytes = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();
        String base64Key = Base64.getEncoder().encodeToString(keyBytes);
        ReflectionTestUtils.setField(provider, "jwtSecret", base64Key);
        ReflectionTestUtils.setField(provider, "jwtExpiration", 3600000L);

        String token = Jwts.builder().setSubject("bob").claim("userId", 5).setIssuedAt(new java.util.Date())
                .setExpiration(new java.util.Date(System.currentTimeMillis()+1000000L))
                .signWith(Keys.hmacShaKeyFor(keyBytes), SignatureAlgorithm.HS256).compact();

        assertEquals(5L, provider.getUserIdFromToken(token));
        assertEquals("bob", provider.getUsernameFromToken(token));
    }

    @Test
    void accessLevelMissingReturnsNull() throws Exception {
        JwtTokenProvider provider = new JwtTokenProvider();
        byte[] keyBytes = Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded();
        String base64Key = Base64.getEncoder().encodeToString(keyBytes);
        ReflectionTestUtils.setField(provider, "jwtSecret", base64Key);
        ReflectionTestUtils.setField(provider, "jwtExpiration", 3600000L);

        String token = Jwts.builder().setSubject("nolevel").claim("userId", 7).setIssuedAt(new java.util.Date())
            .setExpiration(new java.util.Date(System.currentTimeMillis()+1000000L))
            .signWith(Keys.hmacShaKeyFor(keyBytes), SignatureAlgorithm.HS256).compact();

        assertNull(provider.getAccessLevelFromToken(token));
    }
}
