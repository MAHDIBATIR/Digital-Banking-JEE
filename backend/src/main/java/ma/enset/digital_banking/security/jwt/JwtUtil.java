package ma.enset.digital_banking.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import ma.enset.digital_banking.security.entities.AppUser;
import ma.enset.digital_banking.security.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @deprecated This class is deprecated and will be removed in a future release.
 * Please use {@link JwtUtils} instead which provides better security and more features.
 */
@Deprecated
@Component
public class JwtUtil {
    private static final long JWT_TOKEN_VALIDITY = 24 * 60 * 60 * 1000; // 24 hours
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    private final SecurityService securityService;
    
    @Autowired
    public JwtUtil(@Lazy SecurityService securityService) {
        this.securityService = securityService;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        
        try {
            // Add user roles to token claims
            AppUser user = securityService.loadUserByUsername(username);
            List<String> roles = user.getRoles().stream()
                    .map(role -> role.getRoleName())
                    .collect(Collectors.toList());
            
            claims.put("roles", roles);
        } catch (Exception e) {
            System.out.println("Error getting user roles: " + e.getMessage());
        }
        
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY))
                .signWith(key)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
