package com.example.SpringBootApp.infra;

import com.example.SpringBootApp.models.AccessLevel;
import com.example.SpringBootApp.models.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class JwtTokenProviderBranchTest {

    private void setField(Object target, String name, Object value) throws Exception {
        Field f = target.getClass().getDeclaredField(name);
        f.setAccessible(true);
        f.set(target, value);
    }

    @Test
    public void generateValidateAndParseToken_longUserId() throws Exception {
        JwtTokenProvider provider = new JwtTokenProvider();

        String raw = "01234567890123456789012345678901"; // 32 bytes
        String base64 = Base64.getEncoder().encodeToString(raw.getBytes());
        setField(provider, "jwtSecret", base64);
        setField(provider, "jwtExpiration", 1000000L);

        Usuario u = new Usuario();
        u.setId(123L);
        u.setNome("john");
        u.setAccessLevel(AccessLevel.ADM);

        String token = provider.generateToken(u);
        assertTrue(provider.validateToken(token));
        assertEquals("john", provider.getUsernameFromToken(token));
        assertEquals(Long.valueOf(123L), provider.getUserIdFromToken(token));
        assertEquals("ADM", provider.getAccessLevelFromToken(token));
    }

    @Test
    public void integerUserId_isHandled() throws Exception {
        JwtTokenProvider provider = new JwtTokenProvider();

        String raw = "01234567890123456789012345678901";
        String base64 = Base64.getEncoder().encodeToString(raw.getBytes());
        setField(provider, "jwtSecret", base64);
        setField(provider, "jwtExpiration", 1000000L);

        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64));
        Date now = new Date();
        String token = Jwts.builder()
                .setSubject("j")
                .claim("userId", 42) // integer claim
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + 1000000L))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        assertEquals(Long.valueOf(42L), provider.getUserIdFromToken(token));
    }

    @Test
    public void expiredToken_returnsFalse() throws Exception {
        JwtTokenProvider provider = new JwtTokenProvider();

        String raw = "01234567890123456789012345678901";
        String base64 = Base64.getEncoder().encodeToString(raw.getBytes());
        setField(provider, "jwtSecret", base64);
        setField(provider, "jwtExpiration", 1000000L);

        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64));
        Date now = new Date();
        String expired = Jwts.builder()
                .setSubject("j")
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() - 1000))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        assertFalse(provider.validateToken(expired));
    }

    @Test
    public void missingAccessLevel_returnsNull() throws Exception {
        JwtTokenProvider provider = new JwtTokenProvider();

        String raw = "01234567890123456789012345678901";
        String base64 = Base64.getEncoder().encodeToString(raw.getBytes());
        setField(provider, "jwtSecret", base64);
        setField(provider, "jwtExpiration", 1000000L);

        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64));
        Date now = new Date();
        String token = Jwts.builder()
                .setSubject("j")
                .claim("userId", 7)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + 1000000L))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        assertNull(provider.getAccessLevelFromToken(token));
    }
}
